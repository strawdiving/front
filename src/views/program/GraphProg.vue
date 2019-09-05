<template>
<div>
  <div id="viewport">
    <el-tabs type="card">
      <el-tab-pane :label="$t('program.prog')">
        <div id="canvas">
          <div class="prog" v-for="(line, lIndex) in progs" :key="lIndex" 
            :class="['ELSE', 'ELIF'].includes(line.tag)?'else-prog':''" >
            <!-- <div class="line-start"></div> -->
            <prog-line :line="line" :index="lIndex" @click-block="setParam" ref="lines" @expand="onExpand" :draggable="false"></prog-line>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane :label="$t('program.varsConf')">
        <vars></vars>
      </el-tab-pane>
      <el-tab-pane :label="$t('program.funsConf')">
        <funs></funs>
      </el-tab-pane>
      <el-tab-pane :label="$t('program.scriptConf')">
        <segments></segments>
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
export default {
  data() {
    return {
      progName: '',
      blockInfo: null,
      showParam: false,
      configCancel: false,
    }
  },
  computed: {
    progs: function () {
      return this.$store.state.prog.progs
    },
    checkedIndex: function() {
      return this.$store.state.prog.temp.checkedIndex
    }
  },
  methods: {
    resetPlaceholder: function() {
      var phs = document.getElementsByClassName('placeholder')
      for (let i = 0; i < phs.length; i++) {
        phs[i].style['visibility'] = 'hidden'
      }
    },
    setParam: function(index) {
      console.log("click" + JSON.stringify(index))
      if (this.checkedIndex) {
      }

      var block = this.$store.getters.getBlockByIndex(index)
      if (!block) {
        return
      }
      // start, else模块不需显示配置
      if (block.tag && ['ELSE', 'START'].includes(block.tag)) {
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
        var rs = s[i].children[0].children[1].children[0].children
        for (let j = 0; j < rs.length; j++) {
          rs[j].style['height'] = ''
          rs[j].style['height'] = rs[j].children[0].clientHeight + 'px'
          // console.log(rs[j].style['height'])
        }
      }
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
}
</script>

<style scoped>
#viewport {
  position: absolute;
  width: 700px;
  top: 0px;
  bottom: 0;
  left: 0px;
  overflow: auto;
  background-color: #fff;
}
#row-id {
}
#canvas {
  /* position: absolute; */
  width: 98%;
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
</style>
