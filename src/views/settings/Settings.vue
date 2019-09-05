<template>
  <div class="container">
    <el-tabs :tab-position="'top'" style="height:1100px; box-shadow: 0 0 10px #93a3d3;" type="border-card">
      <el-tab-pane :label="$t('settings.coordinates')">
        <coordinate :userCoord = "userCoord" :tcpData = "tcpData"></coordinate>
      </el-tab-pane>
      <!--<el-tab-pane :label="$t('settings.defaultProg')" >-->
        <!--<default-prog :runAuto = "runAuto"></default-prog>-->
      <!--</el-tab-pane>-->
      <el-tab-pane :label="$t('settings.functions')">
        <custom-functions :functionList = "functionList"></custom-functions>
      </el-tab-pane>
      <el-tab-pane :label="$t('settings.modbus')">
        <modbus :modbusData = "modbusList"></modbus>
      </el-tab-pane>
    </el-tabs>
    <div class="bottom-bar">
     <status-bar class="status-bar"></status-bar>
    </div>
  </div>
</template>

<script>
import {updateConfig} from '@/api/index'
import {getConfigs, getFunctionList, getModbusList} from "@/api/config";
import Coordinate from './components/Coordinate'
import CustomFunctions from './components/CustomFunctions'
// import DefaultProg from './components/DefaultProg'
import Modbus from './components/Modbus'
import StatusBar from '@/components/StatusBar'
export default {
  data(){
    return {
      // runAuto: {
      //   defaultProgName: 'acvb',
      //   triggerDigitalIn: 1,
      //   triggerDigitalStatus: true
      // },
      userCoord: [0,0,0,0,0,0],
      tcpData: {
        bias: [0,0,0,0,0,0],
        load: 0,
        loadPos: [0, 0, 0]
      },
      functionList: [],
      modbusList: []
    }
  },
  components: {
    // DefaultProg,
    Modbus,
    CustomFunctions,
    Coordinate,
    StatusBar
  },
  methods: {
    initConfig(){

      getConfigs().then((res) => {
        if (res.status === 200) {
          // sessionStorage.setItem('config', JSON.stringify(res.data))
          let initConfigs = res.data
          // console.log(initConfigs)
          // this.runAuto = initConfigs.runAuto
          // this.runAuto.defaultProgName = initConfigs.runAuto.defaultProgName
          // this.runAuto.triggerDigitalIn = initConfigs.runAuto.digitalIn
          // this.runAuto.triggerDigitalStatus = initConfigs.runAuto.status

          this.userCoord = initConfigs.userCoord.param
          this.tcpData.tcpBias = initConfigs.toolCoord.param

          this.tcpData.pcLoad = initConfigs.toolLoad.weight
          this.tcpData.pcLoadPos = initConfigs.toolLoad.pos
        }
      }).catch((err) => {
        console.log(err)
      })

      getFunctionList().then((res) => {
        if(res.status === 200) {
          this.functionList = res.data.functions
        }
      }).catch((err) => {
        console.log(err)
      })

      this.$store.dispatch('getModbus')

    }
  },
  mounted(){
    this.initConfig()
  },
}
</script>

<style scoped>
  .container {
    padding: 20px;
  }
  .el-tab-pane {
    padding: 20px;
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

<style>
  .el-tabs__item {
    font-size: 15px;
    font-weight: 600;
  }
</style>


