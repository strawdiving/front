<template>
  <div>
    <h3>条件语句</h3>
    <div class="content" :class="{disable: disableModify}">
      <div class="di">
        <div :class="cond.type=='di'?'icon-highlight':'icon-grey'"
          class="icon"
          @click="selectOpt('di')">
        </div>
        当数字输入端口
        <el-select class="port" v-model="di.port" placeholder="数字输入"
          :disabled="cond.type!='di'"
          @change="varChange">
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
        <el-select class="val" v-model="di.val" placeholder="值" :disabled="cond.type!='di'"
          @change="varChange">
          <el-option
            v-for="(item, index) in valOptions"
            :key="item"
            :label="item"
            :value="index">
          </el-option>
        </el-select>
      </div>

      <div class="expr">
        <div :class="cond.type=='expr'?'icon-highlight':'icon-grey'"
          class="icon"
          @click="selectOpt('expr')">
        </div>
        条件表达式 
        <el-input type="text" v-model="expr" :disabled="cond.type!='expr'" @change="varChange">
          <i slot="suffix" class="el-icon-plus" v-if="cond.type=='expr'" @click="openAsst"></i>
        </el-input>
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
    return {
      diNum: 0,
      tdiNum: 0,
      cond: {
        type: 'expr',
        port: 1,
        val: ''
      },
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
      this.cond.type = opt
      this.ifChanged()
    },
    cancel: function() {
      this.$emit('config-cancel')
    },
    confirm: function() {
      if (this.cond.type == 'di') {
        this.cond.port = this.di.port
        this.cond.val = this.di.val
      } else if(this.cond.type == 'expr') {
        this.cond.val = this.expr
      }
      this.$emit('config-confirm', this.cond)
    },
    ifChanged: function() {
      var pre = this.info.cond
      if (this.cond.type == pre.type) {
        if (this.cond.type == 'di') {
          if (this.di.port == pre.port && this.di.val == pre.val) {
            this.$emit('config-change', false)
            return
          }
        }
        if (this.cond.type == 'expr') {
          if (this.expr == pre.val) {
            this.$emit('config-change', false)
            return
          }
        }
      }
      this.$emit('config-change', true)
    },
    varChange: function() {
      this.ifChanged()
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
  },
  mounted() {
    this.diNum = DI_NUM
    this.tdiNum = TDI_NUM
    this.cond = this._.cloneDeep(this.info.cond)

    if (this.cond.type == 'di') {
      this.di.port = this.info.cond.port
      this.di.val = this.info.cond.val
    } else if(this.cond.type == 'expr') {
      this.expr = this.info.cond.val
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
.di {
  height: 60px;
  line-height: 60px;
}
.di .port {
  width: 100px;
}
.di .val {
  width: 80px;
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
