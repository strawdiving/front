<template>
  <div id="container">
    <h3>MOVE</h3>

    <div class="content" :class="{disable: disableModify}">
      <div class="target-field">
        <!-- <span>目标点</span> -->
        <!-- <el-button type="primary" size="small" 
          @click="addPose" icon="el-icon-plus">add</el-button> -->
        <!-- <ul class="target-list">
          <li v-for="(o,index) in traj" :key="index" @click="select(index)"
              :class="selectIndex==index? 'checked-li':''">
            pose {{index}}
            <div v-if="o.pose && o.pose.length!=0" class="icon-set"></div>
          </li>
        </ul> -->
        <el-table
          ref="targetlist"
          :data="traj"
          style="width: 100%"
          highlight-current-row
          @row-click="handleCurrentChange">
          <el-table-column
            label="target" 
            type="index"
            width="70">
          </el-table-column>
          <el-table-column 
            prop="type"
            label="type" 
            width="100">
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                icon="el-icon-plus"
                @click="handleAdd(scope.$index)"></el-button>
              <el-button
                size="mini"
                type="danger"
                icon="el-icon-minus"
                @click="handleDelete(scope.$index, scope.row)"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 根据blockparam.js中的配置定义界面 -->
      <div class="config-field">  
        <div id="type-edit">
          <span>Type</span>
          <el-select v-model="selectedPose.type" @change="typeChange">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>

        <div>
          <div v-for="(o, key) in blockConfig[selectedPose.type].params" :key="key">
            <div class="pose-field" v-if="o.type=='pose'">
              {{o.describe}}
              <div class="edit">
                <el-select size="small" v-model="selectedType" class="select-type">
                  <el-option
                    v-for="(o, index) in poseOpt"
                    :key="index"
                    :label="o.label"
                    :value="o.value"
                  ></el-option>
                </el-select>
                <el-button type="primary" size="small" v-if="selectedType=='2'" @click="callJog(key)" :disabled="varSelect[key].visible">设点</el-button>
                <el-select class="pose-var" size="small" v-if="selectedType=='1'" v-model="selectedPose[key]" @change="varChange(key,$event)">
                  <el-option
                    v-if="selectedPose.type=='MoveJ'"
                    v-for="(o, index) in varOpts1"
                    :key="index"
                    :label="o.name"
                    :value="o.name">
                  </el-option>
                  <el-option
                    v-if="selectedPose.type!='MoveJ'"
                    v-for="(o, index) in varOpts"
                    :key="index"
                    :label="o.name"
                    :value="o.name">
                  </el-option>
                </el-select>
                <el-button size="small" @click="showPose(key)" :disabled="poseSet(key)">移至该点</el-button>
              </div>
            </div>
          </div>
          
          <div v-for="(o,index) in poseParams" :key="index" class="param-item">
            <div class="label">
              {{o.describe}} ({{o.unit}})
            </div>

            <el-input-number class="input-val" size="small" v-if="o.type==Number" v-model="selectedPose.param[index]"
              :min="poseParams[index].min" :max="poseParams[index].max" :step="poseParams[index].step"
              @change="paramChange"
              controls-position="right"/>

            <el-slider class="input-val" v-else-if="o.type=='percentage'" v-model="selectedPose.param[index]" @change="vChange"></el-slider>
            <span v-if="o.type=='percentage'">{{selectedPose.param[index]}}</span>
          </div>

          <div v-if="['MoveL', 'MoveC'].includes(selectedPose.type)" class="advance">
            <div @click="showAdvance=!showAdvance" class="advance-title">
              高级设置
              <i class="el-icon-arrow-right" v-if="!showAdvance"></i>
              <i class="el-icon-arrow-down" v-else></i>
            </div>
            <el-collapse-transition>
              <div v-if="showAdvance">
                <div v-for="(o, index) in advanceParams" :key="index" class="param-item">

                  <div class="label">
                    {{o.describe}} ({{o.unit}})
                  </div>

                  <el-input-number class="input-val" size="small" v-if="o.type==Number" v-model="tempParam[poseParams.length + index]"
                    :min="advanceParams[index].min" :max="advanceParams[index].max" :step="advanceParams[index].step"
                    controls-position="right" :disabled="isDefault[index]" @change="adParamChanged(index, $event)"/>

                  <el-checkbox v-model="isDefault[index]" @change="paramDefaultChange(index, $event)">默认</el-checkbox>
                </div>
              </div>
            </el-collapse-transition>
          </div>

        </div>
      </div>

      <div class="comment-field">
        <span class="label">注释</span>
        <el-input type="textarea" class="desc"></el-input>
      </div>
    </div>
    
    <div class="confirm-field">
      <el-button @click="cancel">Cancel</el-button>
      <el-button type="primary" @click="confirm" :disabled="disableModify">Confirm</el-button>
    </div>
  </div>  
</template>

<script>
import {blockParam} from '../blockparam'
export default {
  props: ['index','info'],
  data() {
    return {
      isMounted: false,
      traj: [],
      //{type: null, pose: [], param:[], wait:0}
      options: [{
        value: 'MoveL',
        label: '',
      },{
        value: 'MoveJ',
        label: '',
      },{
        value: 'MoveC',
        label: '',
      },{
        value: 'tcp_Move',
        label: '',
      },{
        value: 'Move_phi',
        label: '',
      }],

      typeVal: 'MoveL',

      poseOpt: [{
        value: '1',
        label: '设为变量'
      },{
        value: '2',
        label: '移动设点'
      }],

      selectIndex: 0,
      selectedPose: null,

      blockConfig: blockParam,

      showAdvance: false,

      varSelect: {
        pose: {
          visible: false,
          hint: '设为变量'
        },
        posec: {
          visible: false,
          hint: '设为变量'
        }
      },
      poseVar: {
        pose: null,
        posec: null,
      },
      // 记录设置的是pose还是posec
      poseSetKey: 'pose',

      selectedType: '1',
      tempParam: [],
      isDefault: [],
    }
  },
  computed: {
    disableModify: function() {
      return !this.info.enable
    },
    poseParams: function() {
      var params = []
      var ps = this.blockConfig[this.selectedPose.type].params
      for (var prop in ps) {
        if (ps[prop].type !='pose' && ps[prop].group != 'advance') {
          params.push(ps[prop])   
        } 
      }
      return params
    },
    advanceParams: function() {
      var params = []
      var ps = this.blockConfig[this.selectedPose.type].params
      for (var prop in ps) {
        if (ps[prop].type !='pose' && ps[prop].group == 'advance') {
          params.push(ps[prop])   
        } 
      }
      return params
    },
    // 判断advanceParams中的默认参数
    isDefaultParams: function() {
      return this.advanceParams.map((x, index) => {
        return x.default == this.selectedPose.param[this.poseParams.length + index]
      })
    },
    vars: function() {
      return this.$store.state.prog.vars
    },
    varOpts: function() {
      return this.vars.filter((x)=>{return x.type=='pose' || (x.type=='array'&& x.value.len==6)})
    },
    varOpts1: function() {
      return this.vars.filter((x)=>{return x.type=='array'&& x.value.len==7})
    },
    cordPos() {
      let pos = this.$store.state.status.fromPLC.cartesianInfo.actPos
      return pos.map(x=>Math.round(x*100)/100)
    },
    jointPos(){
      var pos = []
      for (let i = 0; i < 7; i++) {
        let v = this.$store.state.status.fromPLC.jointInfo[i].actualPos
        pos.push(Math.round(v * 100)/100)
      }
      return pos
    },
    poseConfirm() {
      return this.$store.state.inner.poseConfirm
    }
  },
  watch: {
    poseConfirm: function (val, oldVal) {
      if (val) {
        this.setPose(this.poseSetKey)
        this.$store.commit('confirmPose', false)
      }
    },
    selectedPose: function(val, oldVal) {
      this.changePoseType()
    },
  },
  methods: {
    poseSet: function(key) {
      if (key == 'pose') {
        return !(this.selectedPose.pose && this.selectedPose.pose.length>0)
      } else if (key == 'posec') {
        return !(this.selectedPose.posec && this.selectedPose.posec.length>0)
      }
    },
    poseVarOpt: function() {
      if (this.selectedPose.type == 'MoveJ') {
        return this.varOpts1
      } else {
        return this.varOpts
      }
    },
    addPose: function() {
      var o = this.createPose()
      this.traj.push(o)
    },

    createPose: function() {
      var o = new Object()
      o.type = 'MoveL'
      o.pose = []
      o.posec = []
      o.param = [100, 500, -1, 888]
      o.wait = 0
      return o
    },
    typeChange: function(type) {
      if (!this.selectedPose) return
      
      switch (type) {
        case 'MoveL':
          this.selectedPose.param = [100, 500, -1, 888]
          break;
        case 'MoveJ':
          this.selectedPose.param = [30, 2000]
          break;
        case 'MoveC':
          this.selectedPose.param = [100, 500, -1, 888]
          break;
        case 'Move_phi':
          this.selectedPose.param = [0, 50]
          break;
        case 'tcp_Move':
          this.selectedPose.param = [0, 0, 0, 0, 0, 0, 100]
          break;
        default:
          break;
      }
      this.initDefault()
      this.ifChanged()
    },
    showPose: function(key) {
      if (key == 'pose') {
        this.$emit('show-jog', { mode: 1, pose: this.selectedPose.pose})
      } else if (key == 'posec') {
        this.$emit('show-jog', { mode: 1, pose: this.selectedPose.posec})
      }
    },
    callJog: function(key) {
      this.poseSetKey = key
      this.$emit('show-jog', { mode: 2 })
    },
    setPose: function(key) {
      var type = this.selectedPose.type
      if (key == 'pose') {
        if (type == 'MoveL' || type == 'MoveC') {
          this.selectedPose.pose = this._.cloneDeep(this.cordPos)
        } else if (type == 'MoveJ') {
          this.selectedPose.pose = this._.cloneDeep(this.jointPos)
        }    
      } else if (key == 'posec') {
        this.selectedPose.posec = this._.cloneDeep(this.cordPos)
      } 
      this.ifChanged()
    },
    selectPose: function(key) {
      if(this.varSelect[key].visible) {
        this.varSelect[key].visible = false
        this.varSelect[key].hint = '设为变量'
      } else {
        this.varSelect[key].visible = true
        this.varSelect[key].hint = '移动设点'
      }
    },
    varChange: function(key,val) {
      // console.log(val)
      this.selectedPose[key] = val
      this.ifChanged()
    },
    handleAdd: function(index) {
      var o = this.createPose()
      this.traj.splice(index+1, 0, o)
      this.ifChanged()
    },
    handleDelete: function(index, row) {
      // console.log(index,row)
      if (this.traj.length > 1) {
        this.traj.splice(row,1)
      }
      this.ifChanged()
    },
    handleCurrentChange: function(row,event,column) {
      // console.log(row)
      this.selectedPose = row
      this.initDefault()
    },
    defaultParam: function(index) {
      return this.selectedPose.param[this.poseParams.length + index]==this.advanceParams[index].default
    },
    paramDefaultChange: function(index, val) {
      var j = this.poseParams.length + index
      if (val) {
        this.selectedPose.param[j] = this.advanceParams[index].default
      } else {
        this.selectedPose.param[j] = this.tempParam[j]
      }
      this.ifChanged()
    },
    adParamChanged: function(index, val) {
      this.selectedPose.param[this.poseParams.length + index] = val
      this.ifChanged()
    },
    initDefault: function() {
      this.tempParam = this._.cloneDeep(this.selectedPose.param)
      this.isDefault = this._.cloneDeep(this.isDefaultParams)
    },
    changePoseType: function() {
      if (Array.isArray(this.selectedPose.pose)) {
        this.selectedType = '2'
      } else {
        this.selectedType = '1'
      }
      if (Array.isArray(this.selectedPose.posec)) {
        this.selectedType2 = '2'
      } else {
        this.selectedType2 = '1'
      }
    },
    cancel: function() {
      this.$emit('config-cancel')
    },
    confirm: function() {
      this.$emit('config-confirm', this.traj)
    },
    ifChanged: function() {
      if (this._.isEqual(this.traj, this.info.params)) {
        this.$emit('config-change', false)
        return
      }
      this.$emit('config-change', true)
    },
    vChange: function() {
      this.ifChanged()
    },
    paramChange: function() {
      this.$nextTick(() => { this.ifChanged() })
    }

  },
  created() {
    this.traj = this._.cloneDeep(this.info.params)
    this.selectedPose = this.traj[0]
    this.changePoseType()
    this.initDefault()
  },
  mounted() {
    this.$nextTick(()=>{
      this.isMounted = true
      this.$refs.targetlist.setCurrentRow(this.selectedPose)
    })
    
  },
  destroyed() {
    
  },
}
</script>

<style scoped>
/* .target-list {
  margin: 10px;
}
.target-list li {
  float: left;
  margin: 8px 20px 10px 0;
  padding: 5px 10px;
  min-width: 20px;
  color: #fff;
  background-color: #5f9edf;
  text-align: center;
  cursor: pointer;
}
.target-list::after {
  content: "";
  display: block;
  clear: both;
}
ul {
  margin: 0;
  padding: 0;
  list-style: none;
}
li {
  display: list-item;
}
.target-list .checked-li {
  background-color: #5588ee; 
  border: 1px solid #888;
}

.icon-set {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: green;
} */
#container {
}
.disable {
  pointer-events: none;
}
.content {
  position: absolute;
  top: 60px;
  right: 0;
  left: 0;
  bottom: 60px;
  overflow: auto;
}
.el-table {
  text-align: left;
}
.config-field {
  /* margin: 30px 5px 10px 10px; */
}
.config-field .pose-field {
  text-align: left;
  margin: 10px 0px 10px 0px;
}
.config-field .pose-field .edit {
  margin-top: 5px;
  margin-left: 10px;
}
.config-field .pose-field .control {
  /* display: inline-block; */
  margin: 10px 0px 0px 60px;
}
.config-field #type-edit {
  text-align: left;
  margin: 5px 0 15px 0;
}
.pose-field .pose-var {
  width: 120px;
}
.pose-field .select-type {
  width: 100px;
}
.param-item {
  height: 40px;
  text-align: left;
  line-height: 40px;
}
.param-item .label {
  display: inline-block;
  width: 160px;
  text-align: left;
  font-size: 15px;
}
.param-item .input-val {
  display: inline-block;
  width: 120px;
  margin: 0 10px 0 5px;
}
.param-item .el-slider {
  width: 100px;
  vertical-align: middle;
  margin: 0 10px 0 5px;
}
.param-item .unit {
  display: inline-block;
}
.advance {
  margin-top: 10px;
}
.advance .advance-title {
  width: 150px;
  text-align: left;
  font-size: 14px;
  font-weight: 600;
  color: #999;
  cursor: pointer;
    /* 禁止内容被选择 */
  user-select: none;
  -moz-user-select: -moz-none;
  -webkit-user-select: none;
  -ms-user-select: none;
}
.comment-field {
  text-align: left;
  display: flex;
  height: 80px;
  width: 340px;
  margin-top: 10px;
}
.comment-field .label {
  -webkit-box-flex: 0;
  flex-grow: 0;
  flex-shrink: 0;
  display: block;
  width: 60px;
}
.comment-field .desc {
  position: relative;
  display: block;
  -webkit-box-flex: 1;
  flex-grow: 1;
  flex-shrink: 1;
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
