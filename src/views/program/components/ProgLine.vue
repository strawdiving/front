<template>
<div class="prog-line">
  <div class="tag-line" :class="isElse? 'tag-line-2':'tag-line-1'" v-if="line.type == 'logic'">
    <!--行间占位符-->
    <!--通过判断typeof(index)确定是首行还是嵌套行-->
    <div v-if="typeof(index)!='number' && !['ELSE','ELIF'].includes(line.tag)" class="line-insert" @dragover="overInsert" 
      @dragenter="enterInsert" @dragleave="leaveInsert" @drop="dropInsert" :index="index">
      <svg xmlns="http://www.w3.org/2000/svg" version="1.1" height="20" width="20" class="line-insert-marker">
        <path d="M10 2 L10 18 L14 14 M10 18.5 L 6 14"
          style="fill:none;stroke:#222;stroke-width:1;fill-rule:evenodd;" />
      </svg>
    </div><ctrl-block :type="line.tag" 
            @click.native="$emit('click-block', {i:index})"
            :class="{'tag-item-checked': isChecked({i:index}), 'item-disable': (line.tag!='START') && !line.enable }"
            :unsaved="isChecked({i: index}) && hasConfigChanged"></ctrl-block>
    <span v-if="line.body" @click="expandNode(line)" class="tree-expand" :class="line.expanded? 'tree-open' : 'tree-close'"></span>
    <span class="cond-exp"></span>
  </div>
  
  <div class="line-body" v-if="line.body">
    <div v-if="line.type == 'action'" class="line-content" @dragover="allowDrop" @drop="drop" :index="index" @dragleave="leaveLine">
      <!--行间占位符-->
      <div v-if="typeof(index)!='number'" class="line-insert" @dragover="overInsert"  
        @dragenter="enterInsert" @drop="dropInsert" @dragleave="leaveInsert" :index="index">
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" height="20" width="20" class="line-insert-marker">
          <path d="M10 2 L10 18 L14 14 M10 18.5 L 6 14"
            style="fill:none;stroke:#222;stroke-width:1;fill-rule:evenodd;" />
        </svg>
      </div>
      <transition-group name="list" tag="p">
        <block :type="o.type" v-for="(o, j) in line.body" :key="o.id" @click.native="$emit('click-block', {i:index, j: j})"
        @dblclick.native="$emit('dbclick-block', {i:index, j: j})"
        @dragstart.native="dragstartProg($event, {i:index, j: j})" 
        @dragend.native="dragendProg"
        draggable class="list-item"
        :class="{'item-checked': isChecked({i: index, j: j}),'item-disable': isDisabled({i: index, j: j})}"
        v-if="o.show"
        :unsaved="isChecked({i: index, j: j}) && hasConfigChanged ">
        {{o.type}}
        </block>
      </transition-group>
      <!--行内占位符-->
      <svg xmlns="http://www.w3.org/2000/svg" version="1.1" height="55" width="2" class="placeholder">
        <line x1="1" y1="0" x2="1" y2="55"
          style="fill:lime;stroke:#59889e;stroke-width:2;fill-rule:evenodd;" />
        <line x1="0" y1="0" x2="2" y2="0"
          style="fill:lime;stroke:#59889e;stroke-width:1;fill-rule:evenodd;" />
        <line x1="0" y1="55" x2="2" y2="55"
          style="fill:lime;stroke:#59889e;stroke-width:1;fill-rule:evenodd;" />
      </svg>
      <div ref="append" class="append-item" id="append" :key="-1">
      </div>
    </div>
    <collapse-transition>
      <div v-show="line.expanded" class="prog-block">
        <div v-for="(child, i) in line.body" :key="i" class="prog-section" id="prog-section">
          <prog-line :line="child" :index="index + '-' + i" v-on:click-block="clickBlock" @expand="$emit('expand')"
            v-on:dbclick-block="dbclickBlock" :class="hasNextElse(line, i)?'else-connecter':''">
          </prog-line>
        </div>
      </div>
    </collapse-transition>
  </div>
  
</div>
</template>

<script>
import CtrlBlock from './CtrlBlock'
import Block from './Block'
import ProgLine from './ProgLine'
import {blockParam} from './blockparam'
import {createBlock, createLine, createLineFromSwap} from './progUtil'
import {CollapseTransition, transitionCallback} from '@/transition/collapse-transition'
export default {
  name: 'prog-line',
  props: ['line', 'index'],
  data() {
    return {
      progStyle: {
        width: 70,
        height: 70,
        hMargin: 10,
        vMargin: 10,
      },
      lineMargin: 20,
      overIndex: -1,
      transitionCallback: null,
    }
  },
  computed: {
    prog: function() {
      return this.$store.state.prog.progs
    },
    isElse: function() {
      return this.line.tag == 'ELSE' || this.line.tag == 'ELIF'
    },
    dragIndex: function() {
      return this.$store.state.prog.temp.dragIndex
    },
    checkedIndex: function() {
      return this.$store.state.prog.temp.checkedIndex
    },
    hasConfigChanged: function() {
      return this.$store.state.prog.temp.configChanged
    }
  },
  watch: {
    // 检测折叠动画是否结束
    transitionCallback: {
      handler: function(newVal, old) {
        if (newVal.left || newVal.enter) {
          this.$emit('expand')
        }
        // console.log(newVal.left)
      },
      deep: true
    }
  },
  methods: {
    dragstartProg: function(ev,index) {
      var msg = {
        type: ev.target.innerText.trim(),
        source: 1,
        index: index
      }

      this.showBlock(index, false)
      // console.log("drag start prog")

      ev.dataTransfer.setData("block", JSON.stringify(msg))
      
      this.showAppendArea()

      this.$store.commit('setDragIndex', {index: index})
    },

    dragendProg: function(ev) {
      // console.log("end")

      this.hideAppendArea()
      this.resetPlaceholder()

      this.progDragStop()
    },

    allowDrop: function(ev) {
      var ex = ev.clientX
      var ey = ev.clientY
      // console.log("allow " + ex + " " + ey)
      
      ev.preventDefault()

      var item = this.findItemElement(ex, ey)
      if (item) {
        var ph = item.line.getElementsByClassName('placeholder')[0]
        ph.style['left'] = item.item.offsetLeft - 5 + 'px'
        ph.style['visibility'] = 'visible'
      } else {
        this.resetPlaceholder() 
      }
    },

    // 不执行drop时停止drag功能块放回到原位
    progDragStop: function() {
      if (this.dragIndex) {
        this.showBlock(this.dragIndex, true)
      }
    },
    drop: function(ev) {
      var progs = this.progs
      var ex = ev.clientX
      var ey = ev.clientY
      var rowDoms = document.getElementsByClassName("line-content")
      var appendDoms = document.getElementsByClassName("append-item")
      var appendDom = appendDoms[0]
      for (let i = 0; i < appendDoms.length; i++) {
        let rect = appendDoms[i].getBoundingClientRect()
        if (ey > rect.top && ey < rect.top + rect.height) {
          appendDom = appendDoms[i]
        }
      }

      var msg = ev.dataTransfer.getData("block")
      // console.log(msg)
      var data = JSON.parse(msg)
      var funType = data.type
      var source = data.source
      var startIndex = data.index || -1

      var index = this.findIndex(ex, ey)
      if (index == -1) {
        return
      }
      console.log("drop" + JSON.stringify(index))
      var o = createBlock(funType)
      
      // 若拖动程序中的功能块
      if (source == 1) {
        let rect = appendDom.getBoundingClientRect()
        // console.log(rect)
        // console.log(ex)
        if (ex > rect.left + rect.width) {
          this.showBlock(startIndex, true)
        } else {
          o = this._.cloneDeep(this.$store.getters.getBlockByIndex(startIndex))
          o.show = true
          this.$store.commit('deleteBlock', {index: startIndex})
          this.$store.commit('insertBlock', {index: index, block: o})
          this.$store.commit('deleteNull', {index: startIndex})
          this.$store.commit('setDragIndex', {index: null})
        }
      }
      if (source == 0) {
        this.$store.commit('insertBlock', {index: index, block: o})
      }
      if (source == 2) {
        var l = createLine(funType)
        this.$store.commit('insertLogicLine', {rowid: index.i, line: l})
        return
      }

      function inside(x,y,element) {
        var rect = element.getBoundingClientRect()
        if (x > rect.left && x < rect.left + rect.width) {
          if (y > rect.top && y < rect.top + rect.height) {
            return true
          }
        }
        return false
      }
    },

    leaveLine: function(ev) {
      // console.log("leave" + " " +ev.relatedTarget.nodeName)
      if (ev.relatedTarget.nodeName !="DIV") {
        ev.stopPropagation()
        return
      }
      this.resetPlaceholder()
    },

    findIndex(x, y) {
      var elements = document.getElementsByClassName("line-content")

      for (let i = 0; i < elements.length; i++) {
        var element = elements[i]
        var rect = element.getBoundingClientRect()
        if (y > rect.top && y <= rect.top + rect.height) {
          if (x > rect.left + this.lineMargin && x <= rect.left + rect.width) {
            var j = Math.round((x - rect.left - this.lineMargin)/this.progStyle.width)
            
            var s = element.getAttribute('index')
            return {i: s, j: j}
          }
        }
      }
      return -1
    },

    findItemElement(x, y) {
      var elements = document.getElementsByClassName("line-content")

      for (let i = 0; i < elements.length; i++) {
        var element = elements[i]
        var rect = element.getBoundingClientRect()
        if (y > rect.top && y <= rect.top + rect.height) {
          if (x > rect.left + this.lineMargin && x <= rect.left + rect.width) {
            var j = Math.round((x - rect.left - this.lineMargin)/this.progStyle.width)
            
            var items = element.getElementsByClassName('list-item')
            if (items.length > j) {
              return {line: element, item: items[j]}
            } else if (items.length == j) {
              var a = element.getElementsByClassName('append-item')
              return {line: element, item: a[0]}
            }
          }
        }
      }
      return null
    },

    resetPlaceholder: function() {
      var phs = document.getElementsByClassName('placeholder')
      for (let i = 0; i < phs.length; i++) {
        phs[i].style['visibility'] = 'hidden'
      }
    },

    showAppendArea: function() {
      var appendDoms = document.getElementsByClassName("append-item")
      for (let i = 0; i < appendDoms.length; i++) {
        appendDoms[i].style['border'] = '#f1f1f1'
        appendDoms[i].style['background'] = '#f1f1f1'
      }
    },
    hideAppendArea: function() {
      var appendDoms = document.getElementsByClassName("append-item")
      for (let i = 0; i < appendDoms.length; i++) {
        appendDoms[i].style['border'] = ''
        appendDoms[i].style['background'] = ''
      }
    },
    showNewLineArea: function() {
      var appendDom = document.getElementById("append-line")
      appendDom.style['border'] = '#f8f8f8'
      appendDom.style['background'] = '#f8f8f8'
    },
    hideNewLineArea: function() {
      var appendDom = document.getElementById("append-line")
      appendDom.style['border'] = ''
      appendDom.style['background'] = ''
    },
    showBlock: function(index, on) {
      if (typeof on != "boolean") {
        return
      }
      this.$store.commit('showBlock', {index: index, on: on})
    },
    enterInsert: function(ev) {
      getEle(ev.target)
      function getEle(ele) {
        if (ele.tagName == 'svg') {
          ele.style['visibility'] = 'visible'
        } else if (ele.tagName == 'DIV'){
          ele.firstChild.style['visibility'] = 'visible'
        } else {
          ele = ele.parentNode
          getEle(ele)
        }
      }
    },
    overInsert: function(ev) {
      ev.preventDefault()
    },
    leaveInsert: function(ev) {
      // console.log(ev)
      if (ev.relatedTarget.nodeName != "DIV") {
        ev.stopPropagation()
        return
      }
      this.resetLineMarker()
      
    },
    dropInsert: function(ev) {
     
      var index
      getEle(ev.target)

      var msg = ev.dataTransfer.getData("block")
      var data = JSON.parse(msg)
      var funType = data.type

      if (['IF','ELSE','ELIF','WHILE'].includes(funType)) {
        var l = createLine(funType)
        this.$store.commit('insertLogicLine', {rowid: index, line: l})
      } else {
        var l
        if (data.source == 1) {
          // block从某一行拖动到新建的行
          var from = data.index
          var block = this._.cloneDeep(this.$store.getters.getBlockByIndex(from))
          l = createLineFromSwap(block)
          this.$store.commit('deleteBlock', {index: from})
          this.$store.commit('insertLine', {rowid: index, line: l})
          this.$store.commit('deleteNull', {index: from})

        } else {
          l = createLine(funType)
          this.$store.commit('insertLine', {rowid: index, line: l})
        }
      }

      this.resetLineMarker()

      function getEle(ele) {
        if (ele.tagName == "DIV") {
          index = ele.getAttribute('index')
        } else {
          getEle(ele.parentNode)
        }
      }
    },
    resetLineMarker: function() {
      var lms = document.getElementsByClassName('line-insert-marker')
      for (let i = 0; i < lms.length; i++) {
        lms[i].style['visibility'] = 'hidden'
      }
    },

    clickBlock: function(index) {
      this.$emit('click-block', index)
    },
    dbclickBlock: function(index) {
      this.$emit('dbclick-block', index)
    },

    expandNode: function(line) {
      if (line.expanded == null) {
        return
      }
      line.expanded = !line.expanded
      // setTimeout(()=>{
      //   this.$emit('expand')
      // },500)
      
    },
    isChecked: function(index) {
      if (!this.checkedIndex) return false
      if (this.checkedIndex.i == index.i && this.checkedIndex.j == index.j) return true
      return false
    },

    isDisabled: function(index) {
      var line = this.prog
      if (typeof index.i == 'number') {
        line = line[index.i]
        if (!line.enable) return true
      } else {
        var ind = index.i.split('-').map(x => { return parseInt(x) })
        for (let i = 0; i < ind.length; i++) {
          if (i == 0) {
            line = this.prog[ind[i]]
          } else {
            line = line.body[ind[i]]
          }
          if (!line.enable) return true
        }
      }
      if ('j' in index) {
        if (!line.body[index.j].enable) return true
      }
      return false
    },
    // if..elif..else连线
    hasNextElse: function(line, i) {
      var len = line.body.length
      var tag = line.body[i].tag
      if (['IF','ELIF'].includes(tag) && i < len - 1 && ['ELSE', 'ELIF'].includes(line.body[i+1].tag)) {
        return true
      }
      return false
    },
  },
  created() {
    this.transitionCallback = transitionCallback
  },
  mounted() {

  },
  beforeDestroy() {
  },
  components: {
    CtrlBlock,
    Block,
    ProgLine,
    CollapseTransition
  }

}
</script>

<style>
.prog-line {
  background: #fff
}
.line-body {
  margin-top: 2px;
  text-align: left;
  display: flex;
  flex-flow: column nowrap;
  /* align-items: center; */
}
.tag-line {
  padding-top: 2px;
  padding-bottom: 1px;
  text-align: left;
}
.cond-exp {
  display: inline-block;
  padding-left: 10px;
  vertical-align: middle;
  font-size: 24px;
  cursor: pointer;
}
/* .list-leave-active {
  position: absolute;
} */
.list-enter, .list-leave-to {
/* .list-leave-active for below version 2.1.8 */ 
  /* opacity: 0;
  transform: translateX(30px); */
}
.list-move {
  transition: all 0.5s;
}
.list-item {
  display: inline-block;
  margin-right: 10px;
  vertical-align: middle;
}
.list-item:active {
  background: aqua;
}
.line-move {
  opacity: 0;
  transition: all 0.5s;
}
.item-checked .inner-container{
  border: 2px #888 solid;
  background: rgb(240, 169, 99);
}
.tag-item-checked .inner-container {
  border: 2px #aaa solid;
  background: #308edd;
}
.item-disable .inner-container{
  border: 2px #aaa dashed;
  background: #ccc;
  color: #888;
}
.append-item {
  width: 70px;
  height: 60px;
}
.line-content {
  /* width: 100%; */
  height: 70px;
  text-align: left;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
}

.prog-section {
  display: flex;
  flex-direction: row;
  text-align: left;
  flex-wrap: wrap;
}
.prog-section::before {
  content: '';
  display: inline-block;
  border-right: 2px solid #888;
  width: 30px;
}
.prog-section:last-child::before {
  content: '';
  display: inline-block;
  border-right: 2px solid #888;
  width: 30px;
  height: 35px;
}

.prog-section div.tag-line-1::before{
  content: '';
  display: inline-block;
  border-top: 2px solid #888;
  width: 32px;
  height: 1px;
}
.prog-section div.tag-line-2::before{
  content: '';
  display: inline-block;
  width: 32px;
  height: 10px;
}
.prog-section div.prog-section::before {
  content: '';
  border-right: 2px solid #888;
  width: 30px;
  margin-left: 30px;
  height: 100%;
}
.prog-section div.prog-section:last-child::before {
  content: '';
  border-right: 2px solid #888;
  width: 30px;
  margin-left: 30px;
  height: 35px;
}
.else-connecter>.line-body>.prog-block>div.prog-section::before{
  content: '';
  border-right: 2px solid #888;
  width: 30px;
  /* margin-left: 30px; */
  height: 100%;
}
.prog-section div.line-content::before {
  content: '';
  border-top: 2px solid #888;
  width: 32px;
}
.placeholder {
  position: absolute;
  visibility: hidden;
}

.tag-line .tree-expand {
  display: inline-block;
  width: 12px;
  height: 12px;
  text-align: center;
  line-height: 11px;
  border: 1px solid #888;
  font-style: normal;
}
.tag-line .tree-close::after {
  content: "+"
}
.tag-line .tree-open::after {
  content: "\2013"
}

.line-placeholder {
  position: absolute;
}
.line-insert {
  width: 40px;
  height: 40px;
}
.line-body .line-insert {
  position: absolute;
  margin-top: -25px;
  margin-left: -10px;
}
.tag-line .line-insert svg {
  transform: translate(50%, 50%);
  visibility: hidden;
}
.line-content .line-insert {
  position: absolute;
  margin-top: 20px;
  margin-left: -20px;
}
.line-content .line-insert svg{
  transform: translate(100%, 50%);
  visibility: hidden;
}
.prog .inner-container:hover{
  border: 2px solid #aaa;
}
</style>
