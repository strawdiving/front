<template>
  <div>
    <h3>While循环</h3>
    <div class="content" :class="{disable: disableModify}">
      <div class="option1">
        <div :class="cond.option=='infinite'?'icon-highlight':'icon-grey'"
          class="icon"
          @click="selectOpt('infinite')">
        </div>
        一直循环
      </div>
      <div class="option2">
        <div :class="cond.option=='count'?'icon-highlight':'icon-grey'"
          class="icon"
          @click="selectOpt('count')">
        </div>
        循环次数:
        <!-- <el-input type="text" v-model="count"
          :disabled="cond.option!='count'"
          @change="valueChange"/> -->
        <el-input-number size="small" v-model="count" :disabled="cond.option!='count'"
          :min="1" @change="valueChange"/>
      </div>
      <div class="option3">
        <div :class="cond.option=='expr'?'icon-highlight':'icon-grey'"
          class="icon"
          @click="selectOpt('expr')">
        </div>
        自定义表达式
        <el-input type="text" v-model="expr"
          :disabled="cond.option!='expr'"
          @change="valueChange">
          <i slot="suffix" class="el-icon-plus" v-if="cond.option=='expr'" @click="openAsst"></i>
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
export default {
  props: ['info'],
  data() {
    return {
      count: 0,
      expr: '',
      cond: {
        option: 'infinite',
        val: ''
      },
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
      this.cond.option = opt
      this.ifChanged()
    },
    cancel: function() {
      this.$emit('config-cancel')
    },
    confirm: function() {
      var opt = this.cond.option
      if (opt == 'expr') {
        this.cond.val = this.expr
      } else if (opt == 'count') {
        this.cond.val = this.count
      }

      this.$emit('config-confirm', this.cond)
    },
    ifChanged: function() {
      var pre = this.info.cond
      if (this.cond.option == pre.option) {
        if (this.cond.option == 'expr') {
          if (this.expr == pre.val) {
            this.$emit('config-change', false)
            return
          }
        }
        if (this.cond.option == 'count') {
          if (this.count == pre.val) {
            this.$emit('config-change', false)
            return
          }
        }
      }
      this.$emit('config-change', true)
    },
    valueChange: function() {
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
    this.cond = this._.cloneDeep(this.info.cond)
    
    if (this.cond.option == 'expr') {  
      this.expr = this.cond.val
    } else if (this.cond.option == 'count') {
      this.count = this.cond.val
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
.option1 {
  height: 40px;
}
.option2 {
  height: 60px;
}
.option2 .el-input {
  width: 100px;
}
.option3 {
  height: 100px;
}
.option3 .el-input {
  display: block;
  width: 200px;
  margin-left: 30px;
  margin-top: 8px;
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
