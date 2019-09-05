<template>
  <div>
    <h3>相机拍照抓取</h3>
    <div class="content" :class="{disable: disableModify}">
      <div class="pose">
        <span class="title">拍照点</span>
        <div>
          <el-select size="small" v-model="poseType1">
            <el-option
              v-for="(o, index) in poseOpt"
              :key="index"
              :label="o.label"
              :value="o.value"
            ></el-option>
          </el-select>
          <el-select class="pose-var" size="small" v-if="poseType1=='1'" v-model="poseVar1" @change="varChange(1,$event)">
            <el-option
              v-for="(o, index) in varOpts"
              :key="index"
              :label="o.name"
              :value="o.name">
            </el-option>
          </el-select>
          <el-button size="small" v-if="poseType1=='2'" type="primary" @click="callJog(1)">设点</el-button>
          <el-button size="small" @click="showPose(1)" :disabled="poseSet(1)">移至该点</el-button>
        </div>
      </div>
      <div class="pose">
        <span class="title">抓取点</span>
        <div>
          <el-select size="small" v-model="poseType2">
            <el-option
              v-for="(o, index) in poseOpt"
              :key="index"
              :label="o.label"
              :value="o.value"
            ></el-option>
          </el-select>
          <el-select class="pose-var" size="small" v-if="poseType2=='1'" v-model="poseVar2" @change="varChange(2,$event)">
            <el-option
              v-for="(o, index) in varOpts"
              :key="index"
              :label="o.name"
              :value="o.name">
            </el-option>
          </el-select>
          <el-button size="small" v-if="poseType2=='2'" type="primary" @click="callJog(2)">设点</el-button>
          <el-button size="small" @click="showPose(2)" :disabled="poseSet(2)">移至该点</el-button>  
        </div>
      </div>
      <div class="offset">
        <span class="title">相机返回的位置补偿</span>
        <el-select size="small" v-model="offsetType" class="type">
          <el-option
            v-for="(o, index) in offsetOpt"
            :key="index"
            :label="o.label"
            :value="o.value"
          ></el-option>
        </el-select>
        <el-select size="small" v-if="offsetType=='1'" v-model="offsetVar" class="type">
          <el-option
            v-for="(o, index) in varOpts"
            :key="index"
            :label="o.name"
            :value="o.name">
          </el-option>
        </el-select>
        <div class="param-def" v-if="offsetType=='2'">
          <div v-for="(o, index) in offsetValue" :key="index" class="item">
            <span class="tag">{{tags[index]}}</span>
            <!-- <el-input v-model.number="param.offset[index]" size="small" @change="inputChange"></el-input> -->
            <el-input-number size="small" controls-position="right" v-model="offsetValue[index]" @change="inputChange"></el-input-number>
          </div>
        </div>
      </div>
      <div class="speed">
        <span class="title">速度</span>
        <!-- <el-input size="small" v-model.number="param.v" @change="inputChange"></el-input> -->
        <el-input-number size="small" controls-position="right" v-model="param.v" 
          :min="0" @change="inputChange"></el-input-number>
        mm/s
      </div>
    </div>
    <div class="confirm-field">
      <el-button @click="cancel">Cancel</el-button>
      <el-button type="primary" @click="confirm" :disabled="disableModify">Confirm</el-button>
    </div>
  </div>  
</template>

<script>
export default {
  props: ['index','info'],
  data() {
    return {
      showDisabled: true,
      param: {
        p1: null,
        p2: null,
        offset: null,
        v: 0,
      },
      tags: ['X', 'Y', 'Z', 'RX', 'RY', 'RZ'],
      setIndex: -1,
      poseVar1: null,
      poseVar2: null,
      poseOpt: [{
        value: '1',
        label: '设为变量'
      },{
        value: '2',
        label: '移动设点'
      }],
      poseType1: '1',
      poseType2: '1',
      offsetOpt: [{
        value: '1',
        label: '设为变量'
      },{
        value: '2',
        label: '自定义'
      }],
      offsetType: '1',
      offsetVar: null,
      offsetValue: [0, 0, 0, 0, 0, 0],
    }
  },
  computed: {
    disableModify: function() {
      return !this.info.enable
    },
    poseConfirm() {
      return this.$store.state.inner.poseConfirm
    },
    vars: function() {
      return this.$store.state.prog.vars
    },
    varOpts: function() {
      return this.vars.filter((x)=>{return x.type=='pose' || (x.type=='array'&& x.value.len==6)})
    },
    cordPos() {
      let pos = this.$store.state.status.fromPLC.cartesianInfo.actPos
      return pos.map(x=>Math.round(x*100)/100)
    },
  },
  watch: {
    poseConfirm: function (val, oldVal) {
      if (this.setIndex!=1 && this.setIndex!=2) {
        return
      }
      if (val) {
        this.setPose(this.setIndex)
        this.$store.commit('confirmPose', false)
      }
    }
  },
  methods: {
    poseSet: function(opt) {
      if (opt == 1) {
        return !this.param.p1
      } else if (opt == 2) {
        return !this.param.p2
      }
    },
    showPose: function(index) {
      if (index == 1) {
        this.$emit('show-jog', { mode: 1, pose: this.param.p1 })
      } else if (index == 2) { 
        this.$emit('show-jog', { mode: 1, pose: this.param.p1 })
      }
    },
    callJog: function(index) {
      this.setIndex = index
      this.$emit('show-jog', { mode: 2 })
    },
    setPose: function(index) {
      if (index == 1) {
        this.param.p1 = this._.cloneDeep(this.cordPos)
        console.log(this.param.p1)
      } else if (index == 2) {
        this.param.p2 = this._.cloneDeep(this.cordPos)
      }
      this.ifChanged()
    },
    varChange: function(type, val) {
      if (type == 1) {
        this.param.p1 = val
      } else if (type == 2) {
        this.param.p2 = val
      }
      this.ifChanged()
    },
    cancel: function() {
      this.$emit('config-cancel')
    },
    confirm: function() {
      if (this.offsetType=='1') {
        this.param.offset = this.offsetVar
      } else {
        this.param.offset = this._.cloneDeep(this.offsetValue)
      }

      this.$emit('config-confirm', this.param)
    },
    // 检测是否有改动
    ifChanged: function() {
      if (this._.isEqual(this.info.params, this.param)) {
        this.$emit('config-change', false)
        return
      }
      this.$emit('config-change', true)
    },
    inputChange: function() {
      this.ifChanged()
    }
  },
  created() {
    this.param = this._.cloneDeep(this.info.params)
    if (Array.isArray(this.param.p1)) {
      this.poseType1 = '2'
      
    } else {
      this.poseType1 = '1'
      this.poseVar1 = this.param.p1
    }

    if (Array.isArray(this.param.p2)) {
      this.poseType2 = '2'
    } else {
      this.poseType2 = '1'
      this.poseVar2 = this.param.p2
    }

    if (Array.isArray(this.param.offset)) {
      this.offsetType = '2'
      this.offsetValue = this._.cloneDeep(this.param.offset)
    } else {
      this.offsetType = '1'
      this.offsetVar = this.param.offset
    }
  },
  mounted() {
    this.$on('jog-confirm',()=>{console.log("on confirm")})
  },
}
</script>

<style scoped>
.disable {
  pointer-events: none;
}
.content {
  position: absolute;
  top: 60px;
  right: 0;
  left: 0;
  bottom: 60px;
  margin-bottom: 10px;
  text-align: left;
  overflow: auto;
}
.title {
  display: block;
  height: 30px;
  font-weight: 500;
  color: #777;
  font-size: 14px;
}
.pose {
  height: 80px;
}
.pose-var {
  width: 160px;
}
.pose .el-select {
  width: 100px;
}
.offset {
  /* height: 160px; */
}
.offset .type {
  width: 100px;
  margin-bottom: 10px;
}
.offset .item {
  width: 130px;
  height: 50px;
  float: left;
  font-size: 15px;
}
.offset .item .tag {
  width: 20px;
  display: inline-block;
}
.offset .item .el-input-number {
  width: 100px;
  display: inline-block;
}
.speed {
  display: inline-block;
}
.speed .el-input-number {
  width: 100px;
}
.confirm-field {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  line-height: 60px;
  border-top: 1px solid #e1e1e1;
  text-align: center;
  background: #fff;
}
</style>
