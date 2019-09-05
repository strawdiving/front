<template>
  <div class="container">

    <div id="initMenu" v-if="initVisible">
      <el-button @click="create0" type="primary">{{$t('program.create')}}</el-button><br>
      <el-button @click="open0" type="primary">{{$t('program.open')}}</el-button>
    </div>

    <!-- 图形化形式 -->
    <div id="program" v-show="graphVisible">
      <prog :mode="runMode" @show-jog="showJog" ref="prog"></prog>
    </div>

    <!-- 文本形式 -->
    <div v-if="textVisible">
      <text-prog :mode="runMode"></text-prog>
    </div>

    <div v-show="runSetupVisible" id="setup-run">
      <run-setup ref="runSetup" @start="startProg"></run-setup>
    </div>

    <div id="bottom-bar">
      <el-button class="button menu" @click="openMenu">
        <!--<i class="iconfont icon-menu" @click="openMenu"></i>-->
        <svg-icon icon-class="menu"></svg-icon>
      </el-button>
      <el-button class="button" @click="save">save</el-button>

      <div class="prog-name">
        {{prog.name}}<span v-if="unsaved">*</span>
      </div>
      <!-- <div class="sim">
        <el-switch v-model="simulation"
          active-text="模拟"
          inactive-text="真机"
          @change="simulate">
        </el-switch>
      </div>
      <div class="speed">
        <span class="speed-text">速度</span>
        <el-slider class="speed-slider" v-model="speed" :show-tooltip="false"></el-slider>
        <span>{{speed}}%</span>
      </div> -->
      <!-- <div class="control">
        <el-button @click="stop" size="mini" circle><svg-icon icon-class="stop"></svg-icon></el-button>
        <el-button @click="run" size="mini" circle><svg-icon icon-class="start"></svg-icon></el-button>
        <el-button @click="step" size="mini" circle><svg-icon icon-class="step"></svg-icon></el-button> -->
        <!--<i class="iconfont icon-stop" @click="stop"></i>-->
        <!--<i class="iconfont icon-start" @click="run"></i>-->
        <!--<i class="iconfont icon-step" @click="step"></i>-->
      <!-- </div> -->
      <!--<i class="iconfont icon-move" @click="openJog"></i>-->
      <!-- <el-button class="jogBtn" @click="openJog">
        <svg-icon icon-class="move" ></svg-icon>
      </el-button> -->
      <!--<el-button class="saveBtn" @click="saveGrapgh">-->
        <!--<svg-icon icon-class="task1"></svg-icon>-->
      <!--</el-button>-->
      <status-bar class="status-bar"></status-bar>
    </div>

    <el-dialog class="menu-dialog" :title="menuTitle" :visible.sync="menuVisible"
      :close-on-click-modal="false" center :show-close="false"
      @open="dialogOpened">
      <div class="option" v-if="menuStep==1">
        <el-button @click="create" type="primary">{{$t('program.create')}}</el-button>
        <el-button @click="open" type="primary">{{$t('program.open')}}</el-button>
      </div>

      <div class="creat" v-if="menuStep==2">
        <el-form :model="progCreate" :rules="createRules" label-width="100px" ref="form" class="nameForm">
          <el-form-item :label="$t('program.name')" prop="name">
            <el-input v-model="progCreate.name" auto-complete="off" size="mini">
              <template slot="append">{{progPostfix}}</template>
            </el-input>
          </el-form-item>
          <el-form-item :label="$t('program.type')" prop="type">
            <el-radio-group v-model="progCreate.type">
              <el-radio label="1">{{$t('program.graph')}}</el-radio>
              <el-radio label="2">{{$t('program.text')}}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>

      <div class="open" v-if="menuStep==3">
        <prog-list @select="handleSelect"></prog-list>
      </div>

      <span slot="footer" class="dialog-footer" v-if="menuStep!=1">
        <el-button @click="cancelCreate">{{$t('button.cancel')}}</el-button>
        <el-button @click="prevStep">{{$t('button.prev')}}</el-button>
        <el-button type="primary" @click="confirmCreate">{{$t('button.confirm')}}</el-button>
      </span>
    </el-dialog>

    <el-dialog :width="jogWidth" :visible.sync="jogVisible" :close-on-click-modal="false">
      <control :speed="speed" :mode="ctrlShowMode"></control>
      <div slot="footer" v-if="poseSetting && ctrlShowMode=='jog'">
        <el-button @click="cancelJog">{{$t('button.cancel')}}</el-button>
        <el-button @click="confirmJog">{{$t('button.confirm')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Prog from '@/views/program/Prog'
import TextProg from '@/views/program/TextProg'
import Control from '@/components/Control'
import StatusBar from '@/components/StatusBar'
import ProgList from '@/components/ProgList'
import { generateCode } from './components/genCode'
import RunSetup from '@/components/RunSetup'
import {scriptTask} from '@/api/index'
export default {
  data() {
    return {
      menuStep: 1,
      initVisible: true,
      graphVisible: false,
      textVisible: false,
      menuVisible: false,
      jogVisible: false,
      simulation: false,
      runSetupVisible: false,
      speed: 50,
      prog: {
        type: '1',
        name: '',
      },
      progCreate: {
        type: '1',
        name: ''
      },
      createRules: {
        name: [
          {required: true, message: '不能为空'},
          {validator: this.checkName, trigger: 'blur'}
        ]
      },
      progList: null,
      selectName: '',
      runMode: 'show',
      poseSetting: false,
      ctrlShowMode: 'jog',
      unsaved: false,
      intervalId: null,
      runTime: 0,
      runTimeString: '',
    }
  },
  computed: {
    // jointPosRad() {
    //   var pos = [];
    //   for (let i = 0; i < 7; i++) {
    //     let v = this.$store.state.status.fromPLC.jointInfo[i].actualPos;
    //     pos.push(2 * Math.PI * v / 360);
    //   }
    //   return pos;
    // },
    menuTitle: function() {
      if (this.menuStep==1) {
        return ''
      } else if (this.menuStep == 2) {
        return this.$t('program.create')
      } else if (this.menuStep == 3) {
        return this.$t('program.open')
      }
    },
    progPostfix: function() {
      if (this.progCreate.type == '1') {
        return '.gpf'
      } else {
        return '.spf'
      }
    },
    scriptList: function() {
      return this.$store.state.script.scriptList
    },
    graphList: function() {
      return this.$store.state.script.graphList
    },

    jogWidth: function() {
      if (this.ctrlShowMode == 'jog') {
        return '70%'
      } else if (this.ctrlShowMode == 'show') {
        return '35%'
      }
    },
    gProg: function() {
      return this.$store.state.prog
    },
    programRun: function() {
      return this.$store.state.status.progInfo.progRunning
    },
    repeat: function() {
      return this.$store.state.script.repeat
    },
    activeProg: function() {
      return this.$store.state.script.activeProg
    }
  },
  watch: {
    gProg: {
      handler: function(newVal, old) {
        this.unsaved = true
        // console.log('prog modified')
      },
      deep: true
    },
    programRun: function (newVal, oldVal) {
      if (newVal && !oldVal) {
        this.startTimer()
      }
      if (!newVal && oldVal) {
        this.stopTimer()
        this.checkRepeat()
      }
    },
  },
  methods: {
    checkName: function(rule, value, callback) {
      let reg =  /[<>/\\\|:"\*\?]/
      if (reg.test(value)) {
        return callback(new Error("程序名不合法"))
      }
      if (this.progCreate.type == '1') {
        if (this.graphList.map(x=>{ return x.name }).includes(value + '.gpf')) {
          return callback(new Error("程序名已存在"))
        }
      } else if (this.progCreate.type == '2') {
        if (this.scriptList.map(x=>{ return x.name }).includes(value + '.spf')) {
          return callback(new Error("程序名已存在"))
        }
      }
      return callback()
    },
    create0: function() {
      this.initVisible = false
      this.menuVisible = true
      this.menuStep = 2
    },
    open0: function() {
      this.initVisible = false
      this.menuVisible = true
      this.menuStep = 3
    },
    create: function() {
      this.menuStep = 2
    },
    open: function() {
      this.menuStep = 3
    },
    saveGrapgh: function() {
      var currentProg = this.$store.state.prog
      var o = {}
      o.progs = currentProg.progs
      o.vars = currentProg.vars
      o.funs = currentProg.funs
      o.segments = currentProg.segments

      var data = {
        name: this.prog.name,
        content: o,
      }
      console.log('save...')
      return this.$store.dispatch('updateGraph', data)
    },
    cancelCreate: function() {
      this.menuVisible = false
      this.menuStep = 1
      
      // 若无已打开的程序
      if (!this.prog.name) {
        this.initVisible = true
      }
    },
    confirmCreate: function() {
      if (this.menuStep === 2) {
        this.confirmCreateProg()
      } else if (this.menuStep === 3) {
        this.confirmOpenProg()
      }

    },
    confirmCreateProg: function() {
      this.$refs['form'].validate((valid)=> {
        if (valid) {
          this.menuVisible = false
          this.menuStep = 1
          if (this.progCreate.type == 1) {
            this.prog.type = '1'
            this.textVisible = false
            this.graphVisible = true
            this.prog.name = this.progCreate.name + '.gpf'
            this.$store.dispatch('createGraph', {name: this.progCreate.name + '.gpf'})
            this.$store.commit('clearAllProg')
            this.$refs['prog'].init()
          } else if (this.progCreate.type == 2) {
            this.graphVisible = false
            this.textVisible = true
            this.prog.type = '2'
            this.prog.name = this.progCreate.name + '.spf'
          }
          this.unsaved = true
          this.$store.commit('setActiveProg', this.prog)

        } else {
          return false
        }
      })
    },
    confirmOpenProg: function() {
      if (!this.selectName) {
        this.$message('未选择程序')
        return 
      }
      if (this.prog.type == '1') {
        this.$store.dispatch('getGraph', {name: this.selectName}).then((res)=>{
          
          this.$store.commit('setProg', JSON.parse(res.data.content))
          this.menuVisible = false
          this.menuStep = 1
          this.graphVisible = true
          this.textVisible = false
          this.prog.name = this.selectName
          this.$refs['prog'].init()
        })
      } else if (this.prog.type == '2') {
        this.$store.dispatch('getScript', {name: this.selectName}).then((res)=>{
          this.menuVisible = false
          this.menuStep = 1
          this.graphVisible = false
          this.textVisible = true
          this.prog.name = this.selectName
        }).catch((err)=>{

        })
      }
      this.unsaved = false
      this.$store.commit('setActiveProg', this.prog)
    },
    prevStep: function() {
      this.menuStep = 1;
    },
    handleSelect: function(val) {
      if (val) {
        this.selectName = val.name
        this.prog.type = val.type
      }

    },
    uploadSuccess: function() {

    },
    // 从本地导入程序
    importLocal: function() {

    },

    simulate: function(val) {
      console.log(val)
      this.$store.dispatch('setSimulation', val).then((res)=>{

      }).catch((err)=>{
        console.log('err')
      })

    },
    // 有耦合 menuVisible
    openMenu: function() {
      console.log("open menu")
      this.menuVisible = true
      this.$store.dispatch('getScriptList')
      this.$store.dispatch('getProgList')
    },
    save: function() {
      console.log('s')
      this.saveGrapgh()
    },
    openJog: function() {
      this.jogVisible = true
    },

    dialogOpened: function() {
      // this.$store.dispatch('getScriptList')
      // this.$store.dispatch('getProgList')
    },
    cancelJog: function() {
      this.jogVisible = false
      this.poseSetting = false
    },
    confirmJog: function() {
      // this.$emit('jog-confirm')
      this.$store.commit('confirmPose', true)
      this.jogVisible = false
      this.poseSetting = false
    },
    run: function() {
      if (this.prog.type == 2) {
        this.runSetupVisible = true
        this.$refs['runSetup'].checkStart()
      } else if (this.prog.type == 1) {
        var code = generateCode(this.$store.state.prog, {modbus: this.$store.state.config.modbusList})
        console.log(code)
        if(this.unsaved) {
          console.log('saving')
          this.$message('saving...')
          this.saveGrapgh().then((res)=>{
            this.$message('save success')
            this.runSetupVisible = true
            this.$refs['runSetup'].checkGraphStart()
            this.unsaved = false
          }).catch((err)=>{
            this.$message('save failed')
          })
        } else {
          this.runSetupVisible = true
          this.$refs['runSetup'].checkGraphStart()
        }
      }

    },
    pause: function() {
      this.handleScriptTask(this.prog.name, 'pause', this.speed)
    },
    stop: function() {
      this.handleScriptTask(this.prog.name, 'stop', this.speed)
    },
    step: function() {
      this.handleScriptTask(this.prog.name, 'step', this.speed)
    },
    startProg: function() {
      this.runSetupVisible = false
      this.handleScriptTask(this.prog.name, 'start', this.speed)
    },
    handleScriptTask(progName, task, speed){
      if (progName === '') {
        this.$message({
          message: '请选择程序文件',
          type: 'warning'})
        return
      }
      if (!['start', 'stop', 'step', 'pause', 'adjustSpeed'].includes(task)) {
        return
      }
      if (speed < 5 || speed > 100) {
        return
      }
      let para ={
        deviceId: 1,
        cmd: "script",
        data: {
          name: progName,
          task: task,
          speed: speed
        }
      }
      scriptTask(para).then((res) => {
        console.log(res)
      }).catch((err) => {
        console.log(err)
      })
    },
    showJog: function(data) {
      if (data.mode==1) {
        this.ctrlShowMode = 'show'
        this.pose = data.pose
      } else if (data.mode==2) {
        this.ctrlShowMode = 'jog'
      }
      this.poseSetting = true
      this.jogVisible = true
    },
    //启动程序运行计时
    startTimer: function(){
      this.runTime = 0
      this.runTimeString = ''
      var self = this
      
      this.intervalId = setInterval(function(){
        self.runTime += 500
        self.showTimeString(self.runTime)
      }, 500)
    },
    // 停止计时
    stopTimer: function(){
      clearInterval(this.intervalId)
    },
    checkRepeat: function() {
      if (this.repeat.repeated) {
        if (this.repeat.repeatedTimes > 0) {
          this.startProg()
          this.$store.commit('minusRepeatTimes')
        } else if (this.repeatedTimes < 0) {
          this.startProg()
        } else if (this.repeatedTimes === 0) {
          this.$store.commit('enRepeated', false)
        }
      }
    },

  },
  created() {
    if (this.activeProg.type && this.activeProg.name) {
      this.menuVisible = false
      if (this.activeProg.type == '1') {
        this.graphVisible = true
        this.textVisible = false
      }
      if (this.activeProg.type == '2') {
        this.graphVisible = false
        this.textVisible = true
      }
    }
  },
  mounted() {
    this.progList = this.graphList
  },
  components: {
    Prog,
    TextProg,
    Control,
    ProgList,
    RunSetup,
    StatusBar
  }
}
</script>

<style scoped>
.container {
}
#initMenu {
  text-align: center;
  margin-top: 100px;
}
#initMenu .el-button {
  width: 200px;
  margin-top: 20px;
}
#program {
}

#setup-run {
  position: absolute;
  right: 0px;
  top: 0px;
  bottom: 0px;
  width: 400px;
  background: #fff;
}

#bottom-bar {
  position: fixed;
  left: 0px;
  right: 0px;
  bottom: 0px;
  margin: auto;
  width: 100%;
  height: 60px;
  line-height: 60px;
  background: #fff;
  border: 1px solid #ddd;
  display: flex;
  align-items: center;
  flex-flow: row wrap;
}
#bottom-bar .sim {
  width: 150px;
  margin-right: 20px;
  margin-left: 80px;
}
#bottom-bar .speed {
  line-height: 50px;
}
#bottom-bar .speed span{

}
#bottom-bar .speed .speed-slider {
  display: inline-block;
  vertical-align: middle;
  width: 150px;
  padding: 0 10px;
}
#bottom-bar .control {
  margin-left: 20px;
  margin-right: 10px;
}
.icon-stop {
  font-size: 38px;
}
.icon-start {
  font-size: 40px;
}
.icon-step {
  font-size: 38px;
}
#bottom-bar .control .el-button {
  background: transparent;
  margin-left: 0;
  margin-right: 0;
  border: none;
  font-size: 40px;
}
#bottom-bar .control .el-button:hover {
  background-color: #93a3d3;
}
#bottom-bar .button {
  /* background-color: transparent;
  border: none;
  font-size: 24px;
  width: 30px; */
}
#bottom-bar .menu {
  /* background-color: transparent;
  border: none;
  margin-left: 0px;
  font-size: 24px; */
}
#bottom-bar .prog-name {
  margin-left: 40px;
  font-style: oblique;
}

#bottom-bar .jogBtn {
  background-color: transparent;
  border: none;
  margin-left: 20px;
  font-size: 32px;
}
#bottom-bar .iconfont {
  cursor: pointer;
}
#bottom-bar .iconfont:active {
  color: #93a3d3;
}
.menu-dialog .option {
  text-align: center;
}
.menu-dialog .option .el-button {
  width: 60%;
  margin: 20px;
}
.status-bar {
  position: absolute;
  right: 0;
  display: inline-block;
}
</style>
