<template>
  <div class="main">
    <div class="main-container">
      <navbar/>
      <app-main v-if="loadMain"/>
      <!-- <div class="fixed-plugin" v-if="this.$route.path!=='/dashboard'">
        <el-button size="medium" type="primary" icon="el-icon-info" @click="simulationVisible=true" >3D</el-button>
      </div> -->
      <!-- <el-dialog v-el-drag-dialog title="Simulation" :modal=false :append-to-body=true :visible.sync="simulationVisible" @dragDialog="handleDrag" >
        <div class="simContainer">
          <robot-model :jointRad="jointPosRad" :targetPos="ss"></robot-model>
        </div>
      </el-dialog> -->
      <!-- <div class="bottom-bar" v-if="!this.$route.path.includes('/dashboard') && !this.$route.path.includes('/program')">
        <run-bar/>
      </div> -->
    </div>
  </div>
</template>

<script>
import navbar from './Navbar'
import appMain from './AppMain'
import { loadScene } from '@/components/three.js'
// import elDragDialog from '@/directive/el-dragDialog'
export default {
  data() {
    return {
      loadMain: false
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
  components: {navbar,appMain},
  // directives: {elDragDialog},

  methods: {
    // create threejs scene
    createScene: function() {
      loadScene(()=>{
        this.loadMain = true
      })
    }
  },
  mounted() {
    this.createScene()
  },
  beforeDestroy() {
  },
};
</script>

<style lang="css" scoped>
.main {
  position: relative;
  height: 100%;
  width: 100%;
  /* overflow-y: scroll; */
    /* 禁止内容被选择 */
  user-select: none;
  -moz-user-select: -moz-none;
  -webkit-user-select: none;
  -ms-user-select: none;
  }
.fixed-plugin {
  position: fixed;
  top: 180px;
  right: 0;
  width: 64px;
  height: 36px;
  background: rgba(64,158,255,.3);
  z-index: 1031;
  border-radius: 8px 0 0 8px;
  text-align: center;
}
.simContainer {
  height: 400px;
}
.bottom-bar {
  position: fixed;
  left: 0px;
  right: 0px;
  bottom: 0px;
  margin: auto;
  width: 100%;
  height: 50px;
  line-height: 50px;
  background: #fff;
  border: 1px solid #ddd;
  display: flex;
  align-items: center;
  flex-flow: row wrap;
}
/*.content-container {*/
  /*flex: 1;*/
  /*position: absolute;*/
  /*width: 100%;*/
  /*overflow-y: scroll;*/
  /*!*padding: 20px;*!*/
/*}*/
  /*.grid-content {*/
    /*height: 100%;*/
  /*}*/
</style>


