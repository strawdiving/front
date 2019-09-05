<template>
  <div>
    <h3>设定变量值</h3>
    <!-- <div class="button">
      <el-button type="primary" size="small" @click="add">添加</el-button>
      <el-button type="danger" size="small" @click="remove">移除</el-button>
    </div> -->
    
    <!-- <div v-for="(o, index) in sets" :key="index" class="item"> -->
    <div class="content" :class="{disable: disableModify}">
      <div class="output">
        <div :class="set.type=='do'?'icon-highlight':'icon-grey'"
          class="icon"
          @click="selectOpt('do')">
        </div>
        Set Output 
        <el-select class="port" v-model="output.port"
          :disabled="set.type!='do'"
          @change="varChange">
          <el-option
            v-for="o in doNum"
            :label="'DO' + o"
            :value="o"
            :key="o">
          </el-option>
          <!-- 为了与控制柜io区分，末端io按照100+port -->
          <el-option
            v-for="o in tdoNum"
            :label="'toolDO' + o"
            :key="100 + o"
            :value="100 + o">
          </el-option>
        </el-select>
        <el-select class="val" v-model="output.val" :disabled="set.type!='do'"
          @change="varChange">
          <el-option
            v-for="(item, index) in doOpts"
            :key="item"
            :label="item"
            :value="index">
          </el-option>
        </el-select>
      </div>
      <div class="expr">
        <div :class="set.type=='expr'?'icon-highlight':'icon-grey'"
          class="icon"
          @click="selectOpt('expr')">
        </div>
        Set Variable
        <el-select v-model="expr.var" class="var"
          placeholder="选择变量"
          :disabled="set.type!='expr'"
          @change="varChange">
          <el-option
            v-for="item in vars"
            :key="item.name"
            :label="formatLabel(item)"
            :value="item.name"
          ></el-option>
        </el-select>

        <!-- <el-autocomplete
          size="small"
          class="var"
          popper-class="var-autocomplete"
          v-model="expr.var"
          placeholder="输入变量"
          :fetch-suggestions="querySearch"
          @select="handleSelect"
          :disabled="set.type!='expr'">
          <template slot-scope="{ item }">
            <div class="name">{{ item.value = item.name}}</div>
            <span class="type">( {{ item.type }} )</span>
            <div class="desc" v-if="item.comment">{{ item.comment }}</div>
          </template>
        </el-autocomplete> -->
        &nbsp;:
        <el-input class="val" type="text" v-model="expr.val" 
          placeholder="输入表达式" :disabled="set.type!='expr'"
          @change="varChange">
          <i slot="suffix" class="el-icon-plus" v-if="set.type=='expr'" @click="openAsst"></i>
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
import {DO_NUM, TDO_NUM} from '@/constants/config'
export default {
  props: ['info'],
  data() {
    return {
      type: 'do',
      doNum: 0,
      tdoNum: 0,
      sets: [{
        var: '',
        val: ''
      }],
      set: {
        type: 'do',
        var: '',
        val: '',
      },
      doOpts: ['LOW','HIGH'],
      output: {
        port: 1,
        val: 0,
      },
      expr: {
        var: '',
        val: '',
      },
      asstVisible: false,
    }
  },
  computed: {
    vars: function() {
      return this.$store.state.prog.vars
    },
    disableModify: function() {
      return !this.info.enable
    }
  },
  methods: {
    formatLabel: function(o) {
      return `${o.name} ( ${o.type} )`
    },
    // add: function() {
    //   var o = {
    //     var: '',
    //     val: ''
    //   }
    //   this.sets.push(o)
    // },
    // remove: function() {
    //   this.sets.pop()      
    // },
    selectOpt: function(opt) {
      this.set.type = opt
      this.ifChanged()
    },
    querySearch: function(queryString, cb) {
      var results = queryString? this.vars.filter(this.createFilter(queryString)) : this._.cloneDeep(this.vars)
      cb(results)
    },
    createFilter(queryString) {
      return (res) => {
        return (res.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    handleSelect: function() {
      this.ifChanged()
    },
    cancel: function() {
      this.$emit('config-cancel')
    },
    confirm: function() {
      if (this.set.type == 'do') {
        this.set.var = this.output.port
        this.set.val = this.output.val        
      } else if (this.set.type == 'expr') {
        this.set.var = this.expr.var
        this.set.val = this.expr.val
      }
      this.$emit('config-confirm', this.set)
    },
    varChange: function() {
      this.ifChanged()
    },
    ifChanged: function() {
      if (this.set.type == this.info.params.type) {
        if (this.set.type == 'do') {
          if (this.set.var == this.output.port && this.set.val == this.output.val) {
            this.$emit('config-change', false)
            return
          }
        } else if (this.set.type == 'expr') {
          if (this.set.var == this.expr.var && this.set.val == this.expr.val) {
            this.$emit('config-change', false)
            return
          }
        }
      }
      this.$emit('config-change', true)
    },
    openAsst: function() {
      this.asstVisible = true
    },
    closeAsst: function() {
      this.asstVisible = false
    },
    inputExpr: function(word) {
      this.expr.val = this.expr.val + ' ' + word
    },
  },
  mounted() {
    this.set = this._.cloneDeep(this.info.params)
    if (this.set.type == 'do') {
      this.output.port = this.info.params.var
      this.output.val = this.info.params.val
    } else if (this.set.type == 'expr') {
      this.expr.var = this.info.params.var
      this.expr.val = this.info.params.val
    }
    this.doNum = DO_NUM
    this.tdoNum = TDO_NUM
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
.button {
  text-align: right;
  margin-right: 40px;
  height: 50px;
}
.output {
  height: 50px;
}
.output .port {
  width: 120px;
  margin-left: 10px;
}
.output .val {
  width: 100px;
  margin-left: 10px;
}
.item {
  text-align: left;
  height: 45px;
}
.expr .var {
  width: 150px;
}
.expr .val {
  width: 300px;
  margin-top: 5px;
  margin-left: 30px;
}
.var-autocomplete li{
  line-height: normal;
}
.var-autocomplete li .name {
  text-overflow: ellipsis;
  overflow: hidden;
  display: inline-block;
  height: 20px;
  line-height: 20px;
  vertical-align: middle;
}
.var-autocomplete li .type {
  vertical-align: middle;
  font-size: 12px;
  margin-left: 8px;
}
.var-autocomplete li .desc {
  height: 18px;
  line-height: 18px;
  font-size: 12px;
  color: #b4b4b4;
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
