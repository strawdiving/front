<template>
  <div>
    <h3>等待</h3>

    <div class="content" :class="{disable: disableModify}">
      <div class="delay">
        <div :class="typeOpt=='delay'?'icon-highlight':'icon-grey'"
          class="icon"
          @click="selectOpt('delay')">
        </div>
        延时(ms)
        <div class="val">
          <el-input v-model.number="delay" size="small" :disabled="typeOpt!='delay'"
            @change="varChanged"></el-input>
          <div class="hint">范围: 0~10,000</div>
        </div>
      </div>
      <div class="di">
        <div :class="typeOpt=='di'?'icon-highlight':'icon-grey'"
          class="icon"
          @click="selectOpt('di')">
        </div>
        当输入端口
        <el-select class="port" v-model="di.port" placeholder="数字输入" :disabled="typeOpt!='di'"
          @change="varChanged"> 
          <el-option
            v-for="o in diNum"
            :label="'DI' + o"
            :value="o"
            :key="o">
          </el-option>
          <!-- 为了与控制柜io区分，末端io按照100+port -->
          <el-option
            v-for="o in tdiNum"
            :label="'toolDI' + o"
            :key="100 + o"
            :value="100 + o">
          </el-option>
        </el-select>
        为
        <el-select class="val" v-model="di.val" placeholder="值" :disabled="typeOpt!='di'"
          @change="varChanged">
          <el-option
            v-for="(item, index) in valOptions"
            :key="item"
            :label="item"
            :value="index">
          </el-option>
        </el-select>
      </div>
      <div class="expr">
        <div :class="typeOpt=='expr'?'icon-highlight':'icon-grey'"
          class="icon"
          @click="selectOpt('expr')">
        </div>
        条件表达式 
        <div>
          <el-input type="text" v-model="expr" :disabled="typeOpt!='expr'" @change="varChanged">
          <i slot="suffix" class="el-icon-plus" v-if="typeOpt=='expr'" @click="openAsst"></i>
          </el-input>
        </div>
      </div>
    </div>

    <div class="confirm-field">
      <el-button @click="cancel">Cancel</el-button>
      <el-button type="primary" @click="confirm" :disabled="disableModify">Confirm</el-button>
    </div>
    <asst-dialog v-drag-float :show="asstVisible" @close="closeAsst" @input-expr="inputExpr"></asst-dialog>
  </div>
</template>

<script>
import {DI_NUM, TDI_NUM} from '@/constants/config'
export default {
  props: ['info'],
  data() {
    var checkDelay = (rule, value, callback)=>{
      if (value < 0 || value > 10000) {
        callback(new Error('范围必须在(0~10000)之间'))
      } else {
        callback()
      }
    }
    return {
      diNum: 0,
      tdiNum: 0,
      param:{
        type: 'delay',
        val: '',
      },
      rule: {
        delay:[
          {required: true, message: '不能为空'},
          {type: 'number', message: '必须为数字值'},
          {validator: checkDelay, trigger: 'blur'}
        ]
      },
      typeOpt: 'delay',
      delay: 0,
      di: {
        port: 1,
        val: 0,
      },
      expr: '',
      valOptions: ['LOW','HIGH'],
      asstVisible: false,
    }
  },
  computed: {
    disableModify: function() {
      return !this.info.enable
    }
  },
  methods: {
    selectOpt: function(opt) {
      this.typeOpt = opt
      this.ifChanged()
    },
    cancel: function() {
      this.$emit('config-cancel')
    },
    confirm: function() {
      var t = this.typeOpt
      this.param.type = t
      if (t == 'delay') {
        this.param.val = this.delay
      } else if (t == 'di') {
        var o = this._.cloneDeep(this.di)
        this.param.val = o
      } else if (t == 'expr') {
        this.param.val = this.expr
      }
      this.$emit('config-confirm', this.param)
    },
    openAsst: function() {
      this.asstVisible = true
    },
    closeAsst: function() {
      this.asstVisible = false
    },
    inputExpr: function(word) {
      this.expr = this.expr + ' ' + word
    },
    // 判断参数是否有修改
    ifChanged: function() {
      if (this.typeOpt == this.param.type) {
        if (this.typeOpt == 'delay')  {
          if (this.param.val == this.delay) {
            this.$emit('config-change', false)
            return
          }
        }
        if (this.typeOpt == 'di') {
          if (this._.isEqual(this.param.val, this.di)) {
            this.$emit('config-change', false)
            return
          }
        }
        if (this.typeOpt == 'expr') {
          if (this.param.val == this.expr) {
            this.$emit('config-change', false)
            return
          }
        }
      }
      this.$emit('config-change', true)
    },
    // 输入值有改动
    varChanged: function() {
      this.ifChanged()
    }
  },
  mounted() {
    this.diNum = DI_NUM
    this.tdiNum = TDI_NUM
    this.param = this._.cloneDeep(this.info.params)
    var t = this.param.type
    this.typeOpt = t
    if (t == 'delay') {
      this.delay = this.param.val
    } else if (t == 'di') {
      this.di = this._.cloneDeep(this.param.val)
    } else if (t == 'expr') {
      this.expr = this.param.val
    }
  },
}
</script>

<style scoped>
.disable {
  pointer-events: none;
}
.content {
  text-align: left;
}
.delay {
  height: 60px;
}
.delay .val {
  display: inline-block;
  vertical-align: -110%;
}
.delay .el-input {
  margin-left: 5px;
}
.hint {
  font-size: 12px;
  color: #888;
  margin-left: 10px;
}
.di {
  height: 60px;
}
.di .port {
  width: 100px;
}
.di .val {
  width: 90px;
}
.expr {
  height: 120px;
}
.expr .el-input {
  width: 300px;
  display: block;
  margin-top: 10px;
  margin-left: 30px;
}
.param-field {
  text-align: left;
}
.icon {
  width: 16px;
  height: 16px;
  margin-right: 10px;
  border-radius: 8px;
  -moz-border-radius: 50%;
  -webkit-border-radius: 50%;
  vertical-align: text-bottom;
  display: inline-block;
  cursor: pointer;
}
.icon-highlight {
  background-color: rgb(18, 196, 228);
}
.icon-grey {
  background-color: #888;
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
.el-form {
  /* text-align: left; */
}
.el-form-item {
  text-align: left;
}
.expr .el-input {
  width: 240px;
  display: inline-block;
}
.el-icon-plus {
  display: inline-block;
  cursor: pointer;
  font-size: 18px;
  font-weight: 600;
  color: #888;
  line-height: 36px;
}
.el-icon-plus:active {
  color: deepskyblue;
}
</style>
