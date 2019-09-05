<template>
  <div class="area">
    <div id="stencil" @select="document.selection.empty()" v-if="stencilShow">
      <div class="group" @dragstart="dragstart" @dragend="dragend" @dragleave="dragleave">
        <p class="group-title">Base</p>
        <block type="Move" draggable></block>
        <block type="Wait" draggable></block>
        <!-- <block type="IO" draggable></block> -->
        <!-- <block type="reTeach" draggable></block> -->
        <block type="Coord" draggable></block>
        <block type="Set" draggable></block>
        <block type="Modbus" draggable></block>
      </div>

      <div class="group" @dragstart="dragFlowStart" @dragend="dragFlowEnd" @dragleave="dragFlowLeave">
        <p class="group-title">Flow Control</p>
        <ctrl-block type="IF" draggable></ctrl-block>
        <ctrl-block type="ELIF" draggable></ctrl-block>
        <ctrl-block type="ELSE" draggable></ctrl-block>
        <ctrl-block type="WHILE" draggable></ctrl-block>
        <!-- <ctrl-block type="Break" draggable></ctrl-block> -->
        <!-- <ctrl-block type="Thread" draggable></ctrl-block> -->
      </div>
      
      <div class="group" @dragstart="dragstart" @dragend="dragend" @dragleave="dragleave">
        <p class="group-title">Advance</p>
        <block type="Script" draggable></block>
        <block type="Fun" draggable></block>
        <block type="Subprog" draggable></block>
      </div>
      <div class="group" @dragstart="dragstart" @dragend="dragend" @dragleave="dragleave">
        <p class="group-title">Task</p>
        <block type="moveCam" draggable></block>
      </div>
      <div class="group" @dragstart="dragstart" @dragend="dragend" @dragleave="dragleave">
        <p class="group-title">Debug</p>
        <block type="Print" draggable></block>
      </div>
    </div>

    <div id="viewport">
      <el-tabs type="card">
        <el-tab-pane :label="$t('program.prog')">
          <div class="edit" :class="showParam?'edit-fold':''">
            <!-- <i class="iconfont icon-undo" @click="undoProg"></i>
            <i class="iconfont icon-redo" @click="redoProg"></i> -->
            <i class="iconfont icon-delete" @click="clearProg"></i>
            <i class="iconfont icon-block-delete" @click="deleteBlock"></i>
            <i class="iconfont icon-disable" @click="enableBlock"></i>
          </div>
          <div id="canvas">
            <div class="prog" v-for="(line, lIndex) in progs" :key="lIndex" 
              :class="['ELSE', 'ELIF'].includes(line.tag)?'else-prog':''" >
              <!-- <div class="line-start"></div> -->
              <prog-line :line="line" :index="lIndex" @click-block="setParam" ref="lines" @expand="onExpand"
                :class="hasNextElse(lIndex)?'else-connecter':''"></prog-line>
            </div>
            <div id="append-line" @dragover="allowFlowDrop" @drop="flowDrop"></div>
          </div>
        </el-tab-pane>
        <el-tab-pane :label="$t('program.varsConf')">
          <vars ref="vars"></vars>
        </el-tab-pane>
        <el-tab-pane :label="$t('program.funsConf')">
          <funs ref="funs"></funs>
        </el-tab-pane>
        <el-tab-pane :label="$t('program.scriptConf')">
          <segments ref="segments"></segments>
        </el-tab-pane>
      </el-tabs>
    </div>
    
    <el-card id="config" v-if="showParam">
      <block-config :info="blockInfo" :index="checkedIndex"
        @config-cancel="cancelConfig" @config-confirm="confirmConfig" 
        @config-change="configChange1" 
        @show-jog="$emit('show-jog', $event)"
        ref="config">
      </block-config>
    </el-card>

  </div>  
</template>

<script>
import {getBrowserType} from '@/utils/util'
import BlockConfig from './components/BlockConfig'
import Block from './components/Block'
import CtrlBlock from './components/CtrlBlock'
import ProgLine from './components/ProgLine'
import Vars from './components/Vars'
import Funs from './components/Funs'
import Segments from './components/Segments'
import {blockParam} from './components/blockparam'
import {createBlock, createLine} from './components/progUtil'
import {generateCode} from './components/genCode'
export default {
  props: {
    // 可以编辑与只显示两种状态之间切换
    mode: {
      type: String,
      default: 'edit',
    },
  },
  data() {
    return {
      progName: '',
      blockInfo: null,
      showParam: false,
      stencilShow: true,
      mutationListener: null,
      undoStack: [],
      redoStack: [],
      configCancel: false,
    }
  },
  computed: {
    progs: function () {
      return this.$store.state.prog.progs
    },
    hasConfigChanged: function() {
      return this.$store.state.prog.temp.configChanged
    },
    checkedIndex: function() {
      return this.$store.state.prog.temp.checkedIndex
    }
  },
  methods: {
    init: function() {
      this.showParam = false
      this.$refs['funs'].init()
      this.$refs['segments'].init()
    },
    dragstart: function(ev) {
      // console.log(ev)
      var msg = {
        type: ev.target.innerText.trim(),
        source: 0,
      }
      ev.dataTransfer.setData("block", JSON.stringify(msg))

      this.showAppendArea()
    },

    dragend: function(ev) {
      this.hideAppendArea()
      this.resetPlaceholder()
    },

    dragleave: function(ev) {

    },
    allowDrop: function(ev) {
      ev.preventDefault()
    },
    
    dragFlowStart: function(ev) {
      var msg = {
        type: ev.target.innerText.trim(),
        source: 2,
      }
      ev.dataTransfer.setData("block", JSON.stringify(msg))

      this.showNewLineArea()
    },
    
    dragFlowEnd: function(ev) {
      this.hideNewLineArea()
    },

    dragFlowLeave: function(ev) {

    },
    allowFlowDrop: function(ev) {
      ev.preventDefault()
    },
    flowDrop: function (ev) {
      var msg = ev.dataTransfer.getData("block")
      // console.log(msg)

      var data = JSON.parse(msg)

      if (data.source == 1) {
        // 从程序中拖动到新的一行
        var startIndex = data.index
        var o = this._.cloneDeep(this.$store.getters.getBlockByIndex(startIndex))
        o.show = true
        var target = {
          i: this.progs.length,
          j: 0
        }

        this.$store.commit('deleteBlock', {index: startIndex})
        this.$store.commit('insertBlock', {index: target, block: o})
        this.$store.commit('deleteNull', {index: startIndex})
        this.$store.commit('setDragIndex', {index: null})
      } else {      
        var l = createLine(data.type)
        this.$store.commit('pushLine', {line: l})
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

    resetPlaceholder: function() {
      var phs = document.getElementsByClassName('placeholder')
      for (let i = 0; i < phs.length; i++) {
        phs[i].style['visibility'] = 'hidden'
      }
    },
    setParam: function(index) {
      console.log("click" + JSON.stringify(index))
      if (this.checkedIndex) {
        if (this.hasConfigChanged) {
          this.$message('请先保存修改')
          return
        } 
      }

      var block = this.$store.getters.getBlockByIndex(index)
      if (!block) {
        return
      }
      // start, else模块不需显示配置
      if (block.tag && ['START'].includes(block.tag)) {
        return
      }

      // this.$store.commit('checkBlock', {index: index, on: true})
      this.$store.commit('setCheckedIndex', {index: index})
            
      this.blockInfo = block
      if (this.showParam) {
        this.showParam = false
        this.$nextTick(()=>{this.showParam = true})
      } else {
        this.showParam = true
      }
      console.log(this._.cloneDeep(this.blockInfo))
      
    },

    cancelConfig: function() {
      console.log("cancel...")
      this.showParam = false

      this.$store.commit('setCheckedIndex', {index: null})
      
      this.configCancel = false
      
      this.$store.commit('setConfigChanged', {changed: false})
    },
    confirmConfig: function(value) {
      console.log("confirm...")
      // console.log(this._.cloneDeep(value))
      this.showParam = false
      
      // 区别 功能块 和 IF, While逻辑控制块
      if ('j' in this.checkedIndex) {
        this.$store.commit('updateBlockParam', {index: this.checkedIndex, params: value})
      } else {
        this.$store.commit('updateControlBlock', {index: this.checkedIndex, cond: value})
      }

      this.$store.commit('setCheckedIndex', {index: null})
      
      this.configCancel = false
      
      this.$store.commit('setConfigChanged', {changed: false})
    },
    configChange1: function(changed) {
      this.$store.commit('setConfigChanged', {changed: changed})
    },
    clearProg: function() {
      this.$confirm('确定清空程序？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        this.$store.commit('clearProg')
        this.showParam = false
      }).catch(() => {

      })
    },
    undoProg: function() {

    },
    redoProg: function() {

    },
    deleteBlock: function() {
      if (!this.checkedIndex) {
        return
      }
      
      this.$store.commit('deleteBlock', { index: this.checkedIndex })
      this.$store.commit('setCheckedIndex', { index: null })
      this.showParam = false
    },
    enableBlock: function() {
      if (!this.checkedIndex) {
        return
      }
      var block = this.$store.getters.getBlockByIndex(this.checkedIndex)
      var enable = !block.enable
      this.$store.commit('enableBlock', {index: this.checkedIndex, enable: enable})
    },
    // 测试用，实际由后端处理
    generateCode: function() {
      var code = generateCode(this.progs)
      console.log(code)
    },

    onExpand: function() {
      this.$nextTick(()=>{this.updateElse()}) 
    },

    // 兼容chrome, 解决在chrome下if-elif-else不显示连线的问题
    // 原因: chrome 伪元素在不设置其父元素height时，无法使用百分比高度，默认高度为0；
    //       所以实时根据其父元素包含的子元素的高度手动设置其父元素高度
    updateElse: function() {
      // if (getBrowserType()!='chrome') {
      //   return
      // }

      var a = document.getElementsByClassName('prog-section')
      // console.log(a)
      for (let i = 0; i < a.length; i++) {
        var b = a[i].getElementsByClassName('prog-section')
        for(let j = 0; j < b.length; j++) {
          b[j].style['height'] = ''
          b[j].style['height'] = b[j].children[0].clientHeight + 'px'
        }
      }

      var s = document.getElementsByClassName('else-connecter')
      // console.log(s)
      for (let i = 0; i < s.length; i++) {
        var rs = s[i].children[1].children[0].children
        for (let j = 0; j < rs.length; j++) {
          rs[j].style['height'] = ''
          rs[j].style['height'] = rs[j].children[0].clientHeight + 'px'
          // console.log(rs[j].style['height'])
        }
      }
    },

    hasNextElse: function(i) {
      var len = this.progs.length
      var tag = this.progs[i].tag
      // if..elif..else连线
      if (['IF','ELIF'].includes(tag) && i < len - 1 && ['ELSE', 'ELIF'].includes(this.progs[i+1].tag)) {
        return true
      }
      return false
    }

  },
  components: {
    Block,
    CtrlBlock,
    BlockConfig,
    ProgLine,
    Vars,
    Funs,
    Segments,
  },
  mounted() {
    // console.log('prog mount')
    this.mutationListener = this.$store.subscribe((mutation, state)=>{
      // console.log(mutation)
      if (['insertLogicLine', 'insertLine','pushLine'].includes(mutation.type)) {
        this.$nextTick(()=>{
          this.updateElse()
        }) 
        
      }

      // undo/redo
      if (['insertLine', 'insertLogicLine', 'pushLine', 'deleteLine', 'insertBlock', 'deleteBlock','enableBlock', 'updateBlockParam']) {
        
      }
    })
    this.updateElse()
  },
  activated() {
    // console.log('active')
    this.updateElse()
  },
  beforeDestroy() {
    // console.log('prog destroy')
    this.mutationListener = null
  },
}
</script>

<style scoped>
.area {
  position: absolute;
  top: 0;
  bottom: 50px;
  left: 0;
  right: 0;
}
#header {
  height: 36px;
  background-color: #f7f7f7;
  border-bottom: 2px #888 solid;
  display: flex;
  align-items: center;
  flex-flow: row wrap;
  padding: 5px 10px;
}
#header .prog-name {
  margin-left: 10px;
}
#header .iconfont {
  font-size: 20px;
}
.edit {
  text-align: right;
  margin-right: 80px;
  /* position: ab;
  top: 0px;
  right: 0px; */
}
.edit .iconfont:hover {
  cursor: pointer;
}
.edit .iconfont:active{
  color: rgb(107, 107, 221);
}
.edit i {
  margin-left: 20px;
}
.edit-fold {
  margin-right: 440px;
}
#header .info {
  margin-left: 300px;
}
#stencil {
  position: absolute;
  width: 240px;
  top: 10px;
  bottom: 0;
  background: #fff;
  padding: 0 0px 0 10px;
  overflow: auto;
  /* 禁止内容被选择 */
  user-select: none;
  -moz-user-select: -moz-none;
  -webkit-user-select: none;
  -ms-user-select: none;
}
#stencil .group {
  text-align: left;
  margin-top: 20px;
}
#stencil .group .block-container {
  margin: 3px;
}
#stencil .group-title {
  text-align: left;
  font-weight: bold;
}
#viewport {
  position: absolute;
  right: 0;
  top: 10px;
  bottom: 0;
  left: 260px;
  overflow: auto;
  background-color: #fff;
}
#row-id {
}
#canvas {
  margin: 10px 10px 20px 10px;
  scroll-behavior: auto;
  background: #f8f8f8;
  /* 禁止内容被选择 */
  user-select: none;
  -moz-user-select: -moz-none;
  -webkit-user-select: none;
  -ms-user-select: none;
}
.prog {
  margin-top: 6px;
  background-color: #fff;
}
.else-prog {
  margin-top: 0px;
}
div.prog::before {
  content: '';
  display: inline;
  width: 10px;
  height: 60px;
}
#config {
  position: absolute;
  width: 420px;
  top: 0px;
  bottom: 0px;
  right: 0px;
  background: #fff;
  /* scroll-behavior: auto;
  overflow-y: auto; */
}
#button {
  position: fixed;
  bottom: 100px;
  left: 100px;
}
.edit-mark {
  position: absolute;
  width: 3px;
  height: 60px;
  background: rgb(91, 151, 241);
}
#append-line {
  margin-top: 10px;
  margin-left: 10px;
  height: 70px;
  text-align: left;
  /* background: #fff; */
}
.line-start {
  width: 10px;
  margin-left: 10px;
}
</style>
