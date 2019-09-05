<template>
  <div class="container">
    <div>
      <div class="prog-area">
        <div class="prog-title">
          <el-button type="primary" @click="showDialog()">选择程序</el-button>
          <span class="prog-name">
            程序名称：
            <span>&nbsp;&nbsp;{{scriptName}}</span>
          </span>
        </div>
        <div class="repeat">
          <el-radio-group v-model="repeatOpt" @change="optChange">
            <el-radio label="1"><label>单次</label></el-radio>
            <el-radio label="2"><label>无限重复</label></el-radio>
            <el-radio label="3"><label>重复次数： </label>
              <el-input-number size="small" :disabled="repeatOpt!='3'" :min="0" :max="99" v-model.number="repeatedTimes"></el-input-number>
            </el-radio>
          </el-radio-group>
        <!--<el-checkbox v-model="repeated" @change="showRepeat"><label>重复</label></el-checkbox>-->
          <!-- <span v-if="repeatedTimes > 0">{{ repeatedTimes}}</span> -->
        </div>
        <div>
          <div v-if="selectType=='1'" id="graph-prog-div">
            <graph-prog></graph-prog>
          </div>
          <div v-if="selectType=='2'" id="showDiv" class="prog-div" ref="showDiv">
            <div v-for="(o, index) in scriptContent" :key="index" :class="index===programLine?'selectRow':'otherRow'">
              <span class="font-index">{{index + 1}}.</span>&nbsp; <span :class="o.trim().startsWith('#')?'prog-annotation':''">{{o}}</span>
            </div>
          </div>
        </div>

        <div v-if="debugVisible" class="debug-div">
          调试信息:
          <div class="debug-info">
            <div v-for="(o) in debugMsg" :key="o" >
              {{o}}
            </div>
          </div>
        </div>
      </div>

      <div class="setup">
        <div class="option-container">
          <div class="item-label">
            <img v-if="collisionDetect" src="../../assets/img/node_enable.png" width="18px"/>
            <img v-else src="../../assets/img/node_disable.png" width="18px"/>
            <span v-if="collisionDetect">碰撞检测开</span>
            <span v-else>碰撞检测关</span>
          </div>
        </div>

        <div class="info-container">
          <robot-model :jointRad="jointPosRad" :targetPos="this.ss" v-on:collision-wall="checkCollision"></robot-model>
        </div>
        <div class="run-time">
          运行时间：
          <label>{{runTimeString}}</label>
          <span class="program-status">运行状态：
            <label>{{programStatus}}</label>
          </span>
        </div>
        <div class="move" v-if="moveVisible">
          <button @mousedown="moveStartPoint" @mouseup="moveStartRelease">按住移动</button>
        </div>
      </div>
    </div>

    <div id="bottom-bar">
      <div class="sim">
        <el-switch v-model="simulation"
          active-text="仿真"
          inactive-text="真机"
          @change="switchSimulation">
        </el-switch>
      </div>
      <div class="speed">
        <span class="speed-text">速度</span>
        <el-slider class="speed-slider" v-model="speed" :show-tooltip="false" :min="5" :max="100" @change="adjustSpeed"></el-slider>
        <span>{{speed}}%</span>
      </div>
      <div class="control">
        <!-- <el-button @click="stop" size="mini" circle><svg-icon icon-class="stop"></svg-icon></el-button>
        <el-button @click="run" size="mini" circle><svg-icon icon-class="start"></svg-icon></el-button>
        <el-button @click="step" size="mini" circle><svg-icon icon-class="step"></svg-icon></el-button> -->
        <i class="iconfont icon-stop" @click="stop"></i>
        <i class="iconfont icon-pause" v-if="programStatus=='运行中'" @click="pause"></i>
        <i class="iconfont icon-start" v-else @click="run" ></i>
        <i class="iconfont icon-step" @click="step"></i>
      </div>
      <i class="iconfont icon-move" @click="openJog"></i>

      <status-bar class="status-bar"></status-bar>
    </div>

    <el-dialog class="run-dialog" title="选择程序" :visible.sync="selectListVisible" :close-on-click-modal="false" center>
      <prog-list @select="handleSelect"></prog-list>
      <div class="button-group">
        <el-button @click="cancelItem">取消</el-button>
        <el-button type="primary" @click="confirmItem">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="repeatVisible" width="36%">
      <span class="repeat-input">请输入重复次数
        <input type="text" v-number-only placeholder="默认为无限" v-model.number="repeatedTimes" maxlength="2"/>
      </span>
      <div class="button-group">
        <el-button @click="cancelRepeat">取消</el-button>
        <el-button type="primary" @click="confirmRepeat">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="jogVisible" width="36%">
      <jog></jog>
    </el-dialog>
  </div>
</template>

<script>
import GraphProg from '@/views/program/GraphProg'
import Pos from '@/components/Pos'
import ProgList from '@/components/ProgList'
import StatusBar from '@/components/StatusBar'
import Jog from '@/components/Jog'
import {getScripts, getScript, scriptTask, stopTask, moveTo} from '@/api/index'
import {setSimulationMode} from '@/api/param'
export default {
  data() {
    return {
      scriptName: '',
      selectType: '2',
      selectName: '',
      script: '',
      scriptContent: [],
      listLoading: false,
      contentLoading: false,
      selectListVisible: false,
      simulation: true,
      speed: 50,
      debugMsg: [],
      programStatus: '',
      runTime: 0,
      runTimeString: '',
      //
      //定时器id
      intervalId: 0,
      repeatVisible: false,
      repeatOpt: '1',
      repeated: false,
      repeatedTimes: 0,

      // 是否需要检查起始点
      checkStartPoint: true,
      programAxisMoveTo: [],
      xyzMoveTo: [],
      startPointMoveType: 0,

      moveVisible: false,
      debugVisible: false,
      jogVisible: false,

      ss: [1.5,1.5,1.5,0,1,1,0],
    }
  },
  computed: {
    jointPosRad() {
      var pos = [];
      for (let i = 0; i < 7; i++) {
        let v = this.$store.state.status.fromPLC.jointInfo[i].actualPos;
        pos.push(2 * Math.PI * v / 360);
      }
      return pos;
    },
    programRun(){
      return this.$store.state.status.progInfo.progRunning
    },
    printIndex(){
      return this.$store.state.status.progInfo.printIndex
    },
    printMsg() {
      var msg = this.$store.state.status.progInfo.printMsg
      var i = msg.indexOf('\0')
      if (i == -1) {
        return msg
      }
      return msg.substring(0, i)
    },
    jointPos() {
      var pos = []
      for (let i = 0; i < 7; i++) {
        let v = this.$store.state.status.fromPLC.jointInfo[i].actualPos
        pos.push(v)
      }
      return pos
    },
    cordPos() {
      return this.$store.state.status.fromPLC.cartesianInfo.actPos
    },
    programLine() {
      return this.$store.state.status.progInfo.programLine
    },
    collisionDetect() {
      return this.$store.state.setValue.collisionDetectActive
    },
    setValue() {
      return this.$store.state.setValue
    },
  },
  watch: {
    printIndex: function (newIndex, oldIndex) {
      this.debugVisible = true
      this.debugMsg.push(this.$store.state.status.progInfo.printMsg)
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
    programLine: function (newVal, oldVal){
      // 根据programLine确定滚动条位置
      this.$refs.showDiv.scrollTop = newVal * 30
    }
  },
  methods: {
    //获取脚本文件内容
    requireScript(name) {
      let para = {
        name:name
      }
      this.contentLoading = true
      getScript(para).then((res)=>{
        console.log("run",res.data.content)
        this.contentLoading = false
        this.script = res.data.content
        this.scriptContent = this.script.trim().split('\n')
          // console.log(this.scriptContent)
        this.updateProgStatus('READY')
      }).catch((err)=>{
        this.$message.error(err)
      })
    },
    //显示脚本选择对话框
    showDialog(){
      //检测是否有程序在运行中
      if (this.programRun) {
        this.$confirm('是否停止当前程序', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '返回',
          type: 'warning'
        }).then(()=>{
          this.stopProgram()
        }).catch(()=>{
          return
        })
      }
      this.selectListVisible = true
      this.moveVisible = false
    },
    handleSelect(val){
      this.selectName = val.name
      this.selectType = val.type
    },
    cancelItem(){
      this.selectName = ''
      this.selectListVisible = false
    },
    confirmItem(){
      this.selectListVisible = false
      this.scriptName = this.selectName

      if (this.selectType == '1') {
        this.$store.dispatch('getGraph', {name: this.scriptName}).then((res)=>{

          this.$store.commit('setProg', JSON.parse(res.data.content))
          this.updateProgStatus('READY')
        })
      } else if (this.selectType == '2') {
        this.requireScript(this.scriptName)
      }

    },

    run(){
      if (!this.programRun) {
        // check if need to move to the start point manually
        if (!this.repeated && this.checkStartPoint &&(this.repeatedTimes === 0)) {
          var index = 0
          var line = this.scriptContent[index]
          var keyword = line.split('(')[0].trim()
          while (!['Start', 'MoveJ', 'MoveL', 'MoveC_1', 'movej', 'movel', 'movec', 'movec_1'].includes(keyword)) {
            if (index === this.scriptContent.length - 1) break
            line = this.scriptContent[++index]
            keyword = line.split('(')[0].trim()
          }
          if (['Start', 'MoveJ', 'MoveL', 'MoveC_1', 'movej'].includes(keyword)) {
            let para = []
            let pass = false
            if (keyword === 'movej') {
              para = line.split('([')[1].split('],')[0].split(',')
              if (para.length !== 7)  pass = true
            } else {
              para = line.split('(')[1].split(')')[0].split(',')
            }

            let variance = 0
            for (let i = 0; i < 7; i++) {
              if (keyword === 'movej') {
                variance += Math.abs(para[i] - this.jointPos[i])
              } else {
                variance += Math.abs(para[i + 8] - this.jointPos[i])
              }
            }

            if (variance > 1 && !pass) {
              if (keyword === 'movej') {
                for(let i = 0; i < 7; i++) this.programAxisMoveTo[i] = Number(para[i])
              } else {
                for(let i = 8; i < 15; i++) this.programAxisMoveTo[i - 8] = Number(para[i])
              }

              ///
              this.moveVisible = true
              this.startPointMoveType = 0
              console.log(this.programAxisMoveTo)
              return
            }
          }

          if (['movel', 'movec', 'movec_1'].includes(keyword)) {
            let para = []
            let pass = false
            para = line.split('([')[1].split('],')[0].split(',')
            if (para.length !== 6) pass = true

            let variance = 0
            for(let i = 0; i < 6; i++){
              variance += Math.abs(para[i] - this.cordPos[i])
            }
            if (variance > 1 && !pass) {
              for(let i = 0; i < 7; i++) this.xyzMoveTo[i] = Number(para[i])

              //
              this.moveVisible = true
              this.startPointMoveType = 1
              console.log(this.xyzMoveTo)
              return
            }
          }
        }
      }
      this.moveVisible = false
      this.debugMsg = []
      this.handleScriptTask(this.scriptName, 'start', this.speed)

      this.updateProgStatus('RUN')
      this.checkStartPoint = true

      if (this.programRun) {
        this.resumeTimer()
      }
    },
    stop(){
      this.handleScriptTask(this.scriptName, 'stop', this.speed)
      this.updateProgStatus('READY')
    },
    pause(){
      this.handleScriptTask(this.scriptName, 'pause', this.speed)
      this.updateProgStatus('PAUSE')
      this.stopInterval()
    },
    step(){
      if (!this.programRun) {
        this.handleScriptTask(this.scriptName, 'step', this.speed)
        this.updateProgStatus('STEP')
        this.handleScriptTask(this.scriptName, 'start', this.speed)
      }

      this.handleScriptTask(this.scriptName, 'step', this.speed)

    },
    adjustSpeed(val){
      this.handleScriptTask(this.scriptName, 'adjustSpeed', val)
    },

    handleScriptTask(scriptName, task, speed){
      if (this.scriptName === '') {
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
          name: scriptName,
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
    switchSimulation(enable){
      this.$store.commit('setSimulation', enable)
      setSimulationMode(this.setValue)
    },
    // 移动到启动点
    moveStartPoint() {
      if (this.startPointMoveType === 0) {
        moveTo(0, this.programAxisMoveTo, 80).then((res)=>{

        }).catch((err)=>{

        })
      } else if (this.startPointMoveType === 1) {
        moveTo(3, this.xyzMoveTo, 80).then((res)=>{

        }).catch((err)=>{

        })
      }
    },
    moveStartRelease() {
      stopTask()
    },
    //启动程序运行计时
    startTimer(){
      this.runTime = 0
      this.runTimeString = ''

      this.startInterVal()
    },
    resumeTimer() {
      this.startInterVal()
    },
    // 启动计时器
    startInterVal() {
      var self = this
      this.intervalId = window.setInterval(function(){
        self.runTime += 100
        self.showTimeString(self.runTime)
      }, 100)
    },
    // 停止计时器
    stopInterval() {
      if(this.intervalId) {
        window.clearInterval(this.intervalId)
      }
    },
    // 停止计时
    stopTimer(){
      this.stopInterval()
      this.updateProgStatus('READY')
    },
    //格式化时间显示
    showTimeString(timeMs){
      var temp = parseInt(timeMs / 1000)
      var ms = timeMs % 1000
      var seconds = temp % 60
      var minutes = parseInt(temp / 60)
      if (minutes === 0) {
        this.runTimeString = seconds + "." + ms + "s"
      } else {
        this.runTimeString = minutes + "m " + seconds + "." + ms + "s"
      }
      console.log(this.runTimeString)
    },
    updateProgStatus(state) {
      switch (state) {
        case 'READY':
          this.programStatus = '就绪'
          break
        case 'RUN':
          this.programStatus = '运行中'
          break
        case 'PAUSE':
          this.programStatus = '暂停'
          break
        case 'STEP':
          this.programStatus = '单步运行'
          break
      }
    },
    showRepeat(){
      if (this.repeated) {
        this.repeatVisible = true
      }
    },
    checkRepeat() {
      if (this.repeated) {
        if (this.repeatedTimes > 0) {
          this.runProgram()
          this.repeatedTimes--
        } else if (this.repeatedTimes < 0) {
          this.runProgram()
        } else if (this.repeatedTimes === 0) {
          this.repeated = false
        }
      }
    },
    cancelRepeat() {
      this.repeated = false
      this.repeatVisible = false
    },
    confirmRepeat() {
      if (this.repeatedTimes < 0) {
        this.repeatedTimes = -1
      }
      this.repeatVisible = false
    },
    checkCollision(val) {
      if (val) {
        this.$message('collision with wall')
      } else {
        this.$message('Not collision with wall')
      }
    },
    optChange(val) {
      switch (val) {
        case 1:
          this.repeated = false
          this.repeatedTimes = 1
          break;
        case 2:
          this.repeated = true
          this.repeatedTimes = -1
        case 3:
          this.repeated = true
        default:
          break;
      }

    },
    openJog() {
      this.jogVisible = true
    },
    simulate() {

    }
  },
  components: {
    ProgList,
    StatusBar,
    GraphProg,
    Jog
  }
}
</script>

<style scoped>
*{
  box-sizing: border-box;
}
.container {
  /*width: 100%;*/
  /*top: 60px;*/
  padding: 20px;
}
.el-row {
  text-align: left;
  display: flex;
  flex-flow: row wrap;
  justify-content: space-around;
  align-items: stretch;

  /*width: 100%;*/
  /*padding: 20px 20px;*/
  /*margin: auto;*/

}

.prog-area {
  position: absolute;
  right: 450px;
  left: 10px;
  top: 20px;

}
.setup {
  position: absolute;
  width: 400px;
  right: 20px;
  top: 20px;

}
.font-index {
  color: #aaa;
  font-size: 14px;
}
.prog-title {
  text-align: left;
}
.prog-name {
  margin-left: 30%;
}
.repeat {
  float: left;
  margin: 20px 0;
}
.prog-div {
  width: 100%;
  height: 280px;
  border: 1px solid #a0b2e6;
  background: #fff;
  white-space: nowrap;
  overflow: auto;
  text-align: left;
}
/*.prog-annotation {*/
  /*color: #999;*/
  /*font-size: 15px;*/
  /*font-style: italic;*/
/*}*/
.debug-div {
  margin-top: 30px;
}
#graph-prog-div {
  position: relative;
  margin-top: 80px; 
  height: 600px;
}
.debug-info {
  width: 90%;
  height: 100px;
  margin-top: 5px;
  background: #fff;
  overflow: auto;
  border: 1px solid #a0b2e6;
  padding: 5px 10px;
}
.selectRow {
  background: #d6d6d6;
  width: 100%;
  height: 30px;
  line-height: 30px;
  padding-left: 10px;
}
.otherRow {
  height:30px;
  line-height: 30px;
  padding-left: 10px;
}
.run-time {
  height: 40px;
  text-align: left;
  vertical-align: middle;
  margin-top: 20px;
}
.run-time label {
  color: #409EFF;
}
.program-status {
  margin-right: 10%;
  float: right;
}
.option-container, .speed, .control-group {
  padding: 10px 0;
  width: 100%;
  display: -webkit-box;
  -webkit-box-pack: center;
  -webkit-box-align: center;
}
.option-container .item-label {
  margin-right: 20px;
}
.info-container {
  width: 100%;
  height: 325px;
}

.control-group .el-button {
  margin-right: 20px;
}
.run-dialog {
  width: 80%;
}
.button-group {
  text-align: right;
  padding-right: 10px;
}
.run-btn {
  margin-top: 40px;
}
.repeat-input input {
  width: 30%;
  margin: 0 0 20px 10px;
}
.move {
  margin-top: 20px;
  margin-right: 50px;
}
.move button{
  /*height: 40px;*/
  width: 100px;
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
  /* align-items: center; */
  flex-flow: row wrap;
}
#bottom-bar .sim {
  width: 150px;
  height: 100%;
  margin-right: 20px;
  margin-left: 80px;
}
#bottom-bar .speed {
  width: 300px;
  height: 100%;
  line-height: 40px;
  margin-left: 20px;
}
#bottom-bar .speed .speed-slider {
  display: inline-block;
  vertical-align: middle;
  width: 150px;
  padding: 0 10px;
}
#bottom-bar .control {
  height: 100%;
  margin-left: 20px;
  margin-right: 10px;
}
.icon-stop {
  font-size: 38px;
}
.icon-pause {
  font-size: 40px;
}
.icon-start {
  font-size: 40px;
}
.icon-step {
  font-size: 38px;
}
.icon-move {
  font-size: 32px;
  margin-left: 30px;
}
#bottom-bar .iconfont {
  cursor: pointer;
}
#bottom-bar .iconfont:active {
  color: #93a3d3;
}
#bottom-bar .button {
  background-color: transparent;
  border: none;
  font-size: 24px;
  width: 30px;
}
.status-bar {
  position: absolute;
  right: 0;
  display: inline-block;
}
</style>
