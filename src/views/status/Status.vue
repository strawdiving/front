<template>
<div class="status-container">
  <!--<el-radio-group v-model="select" class="radio-group">-->
  <!--<el-radio-button label="日志" class="radio-item"></el-radio-button>-->
  <!--<el-radio-button label="IO状态" class="radio-item"></el-radio-button>-->
<!--</el-radio-group>-->
  <!--<div class="status-content">-->
    <!--<i-o class="container-io" v-show="select==='IO状态'"></i-o>-->
    <!--<log class="container-log" v-show="select==='日志'"></log>-->
  <!--</div>-->
  <el-collapse v-model="activeNames" @change="handleChange" class="statusCategories">
    <el-collapse-item :title="$t('status.IOStatus')" name="IO">
      <el-row :gutter="4">
        <el-col :xs="{span:24}" :sm="{span:12}" :md="{span:6}" :lg="{span:6}">
          <i-o :title="$t('status.digitalInTitle')" :type="input" :table-data="digitalIn"/>
        </el-col>
        <el-col :xs="{span:24}" :sm="{span:12}" :md="{span:6}" :lg="{span:6}">
          <i-o :title="$t('status.digitalOutTitle')" :type="output" :table-data="digitalOut"/>
        </el-col>
        <el-col :xs="{span:24}" :sm="{span:12}" :md="{span:6}" :lg="{span:6}">
          <i-o :title="$t('status.toolInTitle')" :type="input" :table-data="toolIn"/>
        </el-col>
        <el-col :xs="{span:24}" :sm="{span:12}" :md="{span:6}" :lg="{span:6}">
          <i-o :title="$t('status.toolOutTitle')" :type="output" :table-data="toolOut"/>
        </el-col>
        <!--<el-col :xs="{span:24}" :sm="{sapn:24}" :md="{sapn:24}" :lg="{span:24}">-->
          <!---->
        <!--</el-col>-->
      </el-row>
    </el-collapse-item>
    <el-collapse-item :title="$t('status.currentTemperature')" name="temperature">
      <temp-bar/>
    </el-collapse-item>
    <el-collapse-item :title="$t('status.currentPosition')" name="position">
      <el-row :gutter="40">
        <el-col :xs="{span:24}" :sm="{span:8}" :md="{span:8}" :lg="{span:8}">
          <position-card :title="$t('status.jointPosition')" :posType="1" :table-data="jointPos"/>
        </el-col>
        <el-col :xs="{span:24}" :sm="{span:8}" :md="{span:8}" :lg="{span:8}">
          <position-card :title="$t('status.cartesianPosition')" :posType="2" :table-data="cartesianPos"/>
        </el-col>
        <el-col :xs="{span:24}" :sm="{span:8}" :md="{span:8}" :lg="{span:8}">
          <force-card :table-data="tcpExternalForce" :title="$t('status.externalForce')"/>
        </el-col>
      </el-row>
    </el-collapse-item>
    <el-collapse-item :title="$t('status.log')" name="log">
      <div style="height: 250px;">
        <log/>
      </div>
    </el-collapse-item>
  </el-collapse>
  <div class="bottom-bar">
     <status-bar class="status-bar"></status-bar>
  </div>
</div>
</template>

<script>
import Log from './components/Log'
import IO from './components/IO'
import PositionCard from './components/positionCard'
import ForceCard from './components/ForceCard'
import TempBar from '@/components/TempBar'
import StatusBar from '@/components/StatusBar'
import {DI_NUM, DO_NUM, TDI_NUM, TDO_NUM} from '@/constants/config'
export default {
  data() {
    return {
      input: 'I',
      output: 'O',
      activeNames: ['IO','temperature']
    }
  },
  components: {
    IO,
    Log,
    TempBar,
    PositionCard,
    ForceCard,
    StatusBar
  },
  computed: {
    digitalIn(){
      let digitalIn = this.$store.state.status.fromPLC.fbRobotData.digitalIn
      return digitalIn.slice(0, DI_NUM).map(function (currentVal,index) {
        index++
        return {port:"I"+index,status: currentVal}
      })
    },
    digitalOut(){
      let digitalOut = this.$store.state.status.fromPLC.fbRobotData.digitalOut
      return digitalOut.slice(0, DO_NUM).map(function (currentVal,index) {
        index++
        return {port:"O"+index,status: currentVal}
      })
    },
    toolIn(){
      let toolIn = this.$store.state.status.fromPLC.fbRobotData.toolIoIn
      return toolIn.slice(0, TDI_NUM).map(function (currentVal,index) {
        index++
        return {port:"I"+index,status: currentVal}
      })
    },
    toolOut(){
      let toolOut = this.$store.state.status.fromPLC.fbRobotData.toolIoOut
      return toolOut.slice(0, TDO_NUM).map(function (currentVal,index) {
        index++
        return {port:"O"+index,status: currentVal}
      })
    },
    jointPos(){
      let jointInfo = this.$store.state.status.fromPLC.jointInfo
      return jointInfo.map(function (currentVal,index) {
        index++
        return {jointNumber: 'joint'+index,position: currentVal.actualPos}
      })
      },
    cartesianPos(){
      let cartesianPos = this.$store.state.status.fromPLC.cartesianInfo.actPos
      let cartesianTag = ['X','Y','Z','RX','RY','RZ']
      return cartesianPos.map(function (currentVal,index) {
        return {cartesianTag: cartesianTag[index],position: currentVal}
      })
    },
    tcpExternalForce(){
      let tcpExternalForce = this.$store.state.status.fromPLC.cartesianInfo.tcpExternalForce
      let cartesianTag = ['X','Y','Z','RX','RY','RZ']
      return tcpExternalForce.map(function (currentVal,index) {
        return {cartesianTag: cartesianTag[index],externalForce: currentVal}
      })
    }
  },
  methods: {
    handleChange() {

    }
  },
}
</script>

<style scoped>
.status-container {
  height: 100%;
  padding: 20px;
}
</style>
<style>
  .el-collapse {
    box-shadow: 0 0 10px #93a3d3
  }
  .el-collapse-item__header {
    font-size: 16px;
    font-weight: 600;
    padding: 10px 20px;
  }
  .bottom-bar {
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
  }
  .status-bar {
    position: absolute;
    right: 0px;
  }
</style>

