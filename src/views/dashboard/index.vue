<template>
  <div class="container">
      <panel-group></panel-group>
    <el-row :gutter="40">
      <el-col :span="12">
        <div class="chart-wrapper">
          <temp-bar/>
        </div>
      </el-col>
      <el-col :span="12">
        <div style="height: 416px;">
          <robot-model :jointRad="jointPosRad" :targetPos="this.ss"></robot-model>
        </div>
      </el-col>

    </el-row>
  </div>
</template>

<script>
  // import StatusCard from './components/StatusCard'
  // import statusGauge from './components/statusGauge'
  import PanelGroup from './components/PanelGroup'
  import TempBar from '../../components/TempBar'
  export default {
    data() {
      return {
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
    },
    watch: {

    },
    methods: {

    },
    components: {
      PanelGroup,
      // StatusCard,
      // statusGauge,
      TempBar
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
  .chart-wrapper {
     background: #fff;
     padding: 16px 16px 0;
     margin-bottom: 32px;
   }
  .simulation {
    background-color: rgba(255, 255, 255, .5);
    /*background-color: rgba(225, 225, 225, 1);*/
    box-shadow: 0 0 10px #93a3d3;
    /*width: 100%;*/
    padding: 20px 30px;
  }

  .status-area {
    display: flex;
    flex-flow: row wrap;
    justify-content: flex-start;
    align-items: stretch;
  }
  .status-card {
    padding: 0;
  }


</style>

