<template>
  <el-row :gutter="40" class="panel-group">
    <el-col :xs="24" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-time1">
          <svg-icon icon-class="time1" class="card-panel-icon"/>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">{{$t('dashboard.totalTime')}}</div>
          <label class="card-panel-num">{{totalTime}}</label>
        </div>
      </div>
    </el-col>
    <el-col :xs="24" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-time">
          <svg-icon icon-class="time" class="card-panel-icon"/>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">{{$t('dashboard.taskTime')}}</div>
          <label class="card-panel-num">{{currentTime}}</label>
        </div>
      </div>
    </el-col>
    <!--<el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">-->
      <!--<div class="card-panel">-->
        <!--<div class="card-panel-icon-wrapper icon-power">-->
          <!--<svg-icon icon-class="power" class="card-panel-icon"/>-->
        <!--</div>-->
        <!--<div class="card-panel-description">-->
          <!--<div class="card-panel-text">整机功率</div>-->
          <!--<label class="card-panel-num">{{totalPower}}</label>-->
        <!--</div>-->
      <!--</div>-->
    <!--</el-col>-->
    <el-col :xs="24" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-task">
          <svg-icon icon-class="statement" class="card-panel-icon"/>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">{{$t('dashboard.robotState')}}</div>
          <label class="card-panel-num">{{robotStateText}}</label>
        </div>
      </div>
    </el-col>
    <el-col :xs="24" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-task">
          <svg-icon icon-class="task1" class="card-panel-icon"/>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">{{$t('dashboard.currentTask')}}</div>
          <div>
            <label v-if="programRun" class="card-panel-num">{{currentTask}}</label>
            <label v-else class="card-panel-num">{{progName}}</label>
          </div>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import ProgList from '@/components/ProgList'
export default {
  name: "PanelGroup",
  data() {
    return {
      startTime: 0, // 开机时间
      totalTime: 0,
      taskStartTime: 0, // 此次任务开始时间
      currentTime: 0,
      progName: 'None',
      interval1: null,
      interval2: null,
    }
  },
  computed: {
    // totalTime() {
    //     // return 102400 //从开机以后开始计算，ms转化为特定格式
    //
    //   // return this.timeFilter(Date.now() - this.startTime)
    //   },
    // currentTime() {
    //     // return 102400 // 从点击开始进行计时
    //   return this.timeFilter(Date.now() - this.taskStartTime)
    // },
    // totalPower() {
    //     return 998
    // },
    programRun(){
      return this.$store.state.status.progInfo.progRunning
    },
    currentTask() {
        // return 'Task1'
      return this.$store.state.status.fromPLC.taskID
    },
    controllerTemp() {
        return this.$store.state.status.fromPLC.fbRobotData.controllerTemp
    },
    robotState() {
      return this.$store.state.status.fromPLC.fbRobotData.robotState
    },
    robotStateText() {
      const ROBOT_STATE = [
      {key:0,text:"unConnected"},
      {key:1,text:"power"},
      {key:2,text:"initial"},
      {key:3,text:"disable"},
      {key:4,text:"enable"},
      {key:5,text:"standstill"},
      {key:6,text:"moving"},
      {key:7,text:"stopping"},
      {key:8,text:"estop"},
      {key:9,text:"error"},
      {key:10,text:"recovery"},
      {key:11,text:"idle"},
      {key:98,text:"maintenance"},
      {key:99,text:"userItf"}
     ]
      // console.log(this.robotState)
      return ROBOT_STATE.filter(function (value) {
        return value.key === this.robotState
      },this)[0].text
    }
  },
  watch: {
    robotState(oldVal,newVal) {
      if(oldVal === 0 && newVal === 1) {
        this.startTime = Date.now()
        if (this.interval1) {
          clearInterval(this.interval1)
        }
        this.interval1 = setInterval(function () {
          return this.timeFilter(Date.now() - this.startTime)
        },1000)
      }
    },
    taskState(oldVal,newVal) {
      if(oldVal === 0 && newVal === 1) {
        this.taskStartTime = Date.now()
        if (this.interval2) {
          clearInterval(this.interval2)
        }
        this.interval2 = setInterval(function () {
          return this.timeFilter(Date.now() - this.taskStartTime)
        },1000)
      }
    },
  },
  methods: {
    timeFilter (mseconds) {
      let ss = parseInt(mseconds/1000)// 秒
      let mm = 0// 分
      let hh = 0// 小时
      if (ss > 3600) {
        hh = parseInt(ss / 3600)
        ss = parseInt(ss % 3600)
      }
      if (ss > 60) {
        mm = parseInt(ss / 60)
        ss = parseInt(ss % 60)
      }
      let result = ('00' + parseInt(ss)).slice(-2)
      if (mm > 0) {
        result = ('00' + parseInt(mm)).slice(-2) + ':' + result
      } else {
        result = '00:' + result
      }
      if (hh > 0) {
        result = ('00' + parseInt(hh)).slice(-2) + ':' + result
      }
      return result
    }
  },
  components: {
    ProgList,
  },
  mounted() {
    this.$store.dispatch('getScriptList')
    this.$store.dispatch('getProgList')
  },
  beforeDestroy() {
    if (this.interval1) {
      clearInterval(this.interval1)
    }
    if (this.interval2) {
      clearInterval(this.interval2)
    }
  },
}
</script>

<style scoped>
.panel-group {
  margin-top: 10px;
}

.card-panel-col {
  margin-bottom: 20px;
}
.card-panel {
  height: 108px;
  cursor: pointer;
  font-size: 12px;
  position: relative;
  overflow: visible;
  color: #666;
  background: #fff;
  box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
  border-color: rgba(0, 0, 0, .05);
}
.card-panel-icon-wrapper {
  float: left;
  margin: 14px 0 0 14px;
  padding: 16px;
  transition: all 0.38s ease-out;
  border-radius: 6px;
  color: #fff
}
.card-panel-icon {
  float: left;
  font-size: 48px;
  }
.card-panel-description {
  float: right;
  font-weight: bold;
  margin: 26px;
  margin-left: 0;
}
.card-panel-text {
  line-height: 18px;
  color: rgba(0, 0, 0, 0.45);
  font-size: 16px;
  margin-bottom: 12px;
}
.card-panel-num {
  font-size: 20px;
}
.load-button {
  margin-left: 0;
  margin-right: 0;
}
/*.icon-time {*/
  /*background: #40c9c6;*/
/*}*/
</style>
