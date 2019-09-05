<template>
  <div id="bar">
    <!-- <div class="prog-name">
      {{prog.name}}
    </div> -->
    <div class="state">
      <label>{{robotStateText}}</label>
    </div>
    <div class="runMode">
        <svg-icon icon-class="robotic-arm" v-if="simulation"></svg-icon>
        <svg-icon icon-class="desktop" v-else></svg-icon>
        <span>{{!simulation?"仿真":"真机"}}</span>
    </div>
    <div class="status">
      <!-- <span class="error-text">错误:   </span> -->
      <label>{{msg}}</label>
    </div>

  </div>
</template>

<script>
export default {
  data() {
    return {
      // simulation: false,
      speed: 50,
      prog: {
        type: '1',
        name: '',
      },
      msg: '',
    }
  },
  computed: {
    progRunning() {
      return this.$store.state.status.progInfo.progRunning
    },
    simulation() {
      return this.$store.state.setValue.simulationMode
    },
    errMsg() {
      return this.$store.state.status.errorInfo.errorMsg
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
      return ROBOT_STATE.filter(function (value) {
        return value.key === this.robotState
      },this)[0].text
    }
  },
  methods: {

  },
  mounted() {

  },
}
</script>

<style scoped>
  #bar {
    width: 400px;
    height: 58px;
    line-height: 60px;
    background: #fff;
    /* border: 1px solid #ddd; */
    display: flex;
    align-items: flex-end;
    flex-flow: row-reverse nowrap;
  }
  #bar .sim {
    width: 200px;
    margin-right: 20px;
    margin-left: 20px;
  }

  #bar .state,.status {
    margin-left: 20px;
    padding: 0 20px;
    /* box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05); */
  }
  .status {
    width: 100px;
    color: #FF0000;
    float: right;
  }
  .status label{
    color: #FF0000;
    margin-left: 35px;
  }
  #bar .state label{
    margin-left: 15px;
    color: #0000FF;
  }

  #bar .prog-name {
    margin-left: 20px;
    font-style: oblique;
  }
  .runMode span {
    text-align: center;
  }
 .svg-icon {
   width: 30px;
   height: 30px;
   font-size: 30px;
   vertical-align: middle;
   background-color: #87CEEB;
 }
</style>
