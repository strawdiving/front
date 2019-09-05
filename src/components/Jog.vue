<template>
  <el-tabs type="card" class="jog-container">
    <el-tab-pane label="移动关节" :disabled="!enableTab">
      <jog-axis :speed ="speed" :title="false"></jog-axis>
    </el-tab-pane>
    <el-tab-pane label="移动末端" :disabled="!enableTab">
      <jog-line :speed="speed" :title="false"></jog-line>
    </el-tab-pane>
    <el-tab-pane label="牵引">
      <teach @teach="inTeach"></teach>
    </el-tab-pane>
    <!-- <el-tab-pane label="速度调节">
      <div class="speed-area">
        <span class="speed-text">{{speed}}%</span>
        <el-slider v-model="speed" :show-tooltip="false"></el-slider>
      </div>
    </el-tab-pane> -->
  </el-tabs>
</template>

<script>
import JogAxis from '@/components/JogAxis'
import JogLine from '@/components/JogLine'
import Teach from '@/components/Teach'
export default {
  props: {
    speed: {
      type: Number,
      default: 50,
    }
  },
  data() {
    return {
      enableTab: true
    }
  },

  methods: {
    inTeach: function(on) {
      this.enableTab = !on
    },
  },
  components: {
    JogAxis,
    JogLine,
    Teach,
  },
}
</script>

<style scoped>
.jog-container {
  width: 95%;
  height: 400px;
  background: #fff;
}
.el-progress {
  width: 200px;
  font-size: 10px;
  display: inline-block;
}
.speed-area {
  width: 90%;
  margin: auto;
}
</style>
