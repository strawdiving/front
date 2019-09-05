<template>
  <div>
    <div class="drag-area" v-if="!teachVisible">
      <div v-if="!axisDragSet" class="drag-div">
        <el-button type="primary" @click="startTeach" class="drag">牵引</el-button>
        <el-slider v-model="dragCompliance" :show-tooltip="false" @change="dragChange"></el-slider>
        <div>牵引柔顺度 {{dragCompliance}}</div>
      </div>
      <div v-else class="drag-div">
        <div v-for="(o, index) in 7" :key="index" class="drag-item">
          <span class="drag-tag">{{o}}</span>
          <el-slider v-model="axisCompliance[index]" @change="dragSepChange"></el-slider>
          <span>{{axisCompliance[index]}}</span>
        </div>
      </div>
      <el-button @click="switchTeachSet">关节柔顺度设置</el-button>
    </div>
    <!-- <el-dialog :visible.sync="teachVisible" class="teach-dialog" :close-on-click-modal="false">
    </el-dialog> -->
    <div v-if="teachVisible">
      <h3>点击确定退出牵引模式</h3>
      <el-button type="primary" @click="exitTeach">确定</el-button>
    </div>
  </div>
</template>

<script>
import {switch2Teach, stopTask} from '@/api'
import {setTeachParam} from '@/api/param'
export default {
  data() {
    return {
      dragCompliance: 50,
      axisDragSet: false,
      axisCompliance: [50,50,50,50,50,50,50],
      teachVisible: false,
    }
  },
  computed: {
    setValue: function() {
      return this.$store.state.setValue
    }
  },
  methods: {
    switchTeachSet() {
      this.axisDragSet = !this.axisDragSet
    },
    startTeach() {
      switch2Teach().then((res) => {
        this.teachVisible = true
        this.$emit('teach', true)
      }).catch((err) =>{
        this.$message({
          message: '无法进入牵引模式',
          type: 'warning'
        })
      })
    },
    exitTeach() {
      this.teachVisible = false
      stopTask().then((res)=>{
        this.$emit('teach', false)
      }).catch((err)=>{

      })
    },
    dragChange() {
      this.$store.dispatch('setTeachSmoothAll', this.dragCompliance)
      // this.$store.commit('setTechSmoothAll', this.dragCompliance)
      // setTeachParam(this.setValue)
    },
    dragSepChange() {
      this.$store.dispatch('setTechSmoothSep', this.axisCompliance)
      // this.$store.commit('setTechSmoothSep', this.axisCompliance)
      // setTeachParam(this.setValue)
    }
  },
  mounted() {
    this.dragCompliance = this.setValue.handTechSmoothAll
    for (let i = 0; i < 7; i++) {
      this.axisCompliance[i] = this.setValue.handTechSmoothSep[i]
    }    
  }
}  
</script>

<style scoped>
.drag-area {
  width: 90%;
  height: 100%;
  margin: auto;
  margin-top: 10px;
}
.drag-div {
  height: 280px;
}
.drag {
  margin-top: 30px;
  margin-bottom: 20px;
}
.drag-item {
  width: 100%;
  height: 40px;
  font-size: 14px;
  display: -webkit-box;
  -webkit-box-pack: left;
  -webkit-box-align: center;
}
.drag-item .drag-tag {
  width: 20px;
}
.drag-item .el-slider {
  width: 80%;
  padding-left: 20px;
  padding-right: 20px;
}
</style>
