<template>
  <div>
    <h3>选择脚本</h3>
    <div class="content" :class="{disable: disableModify}">
      <el-select v-model="script.type" @change="typeChange" class="type">
        <el-option
          v-for="o in option"
          :label="o.label"
          :key="o.value"
          :value="o.value">
        </el-option>
      </el-select>
      <div class="select" v-if="selectVisible">
        <span>执行脚本： </span>
        <span class="name">{{name}}</span>
        <div class="button">
          <el-button size="small" type="primary" @click="select">选择</el-button>
        </div>
      </div>

      <div class="create" v-if="createVisible">
        <!-- <el-button size="small" type="primary" @click="create">Create</el-button> -->
        create script line
        <div class="script-line" >
          <el-input v-model="line" @change="lineChange">
            <i slot="suffix" class="el-icon-plus" @click="openAsst"></i>
          </el-input>
        </div>
      </div>
    </div>

    <el-dialog id="select" title="选择脚本" 
      :visible.sync="listVisible" 
      width="50%">
      <el-table
        :data="scripts"
        highlight-current-row
        close-on-click-modal="false"
        @row-click="handleClick">
        <el-table-column
          type="index"
          width="50">
        </el-table-column>
        <el-table-column
          prop="name"
          label="名称"
          width="100">
        </el-table-column>
        <el-table-column
          prop="desc"
          label="说明"
          width="180">
        </el-table-column>
      </el-table>
      <div slot="footer">
        <el-button @click="listVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmSelect" :disabled="disableModify">确定</el-button>
      </div>
    </el-dialog>

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
  computed: {
    scripts: function () {
      return this.$store.state.prog.segments
    }
  },
  data() {
    return {
      listVisible: false,
      createVisible: false,
      selectVisible: true,
      option: [{
        label: 'Select script',
        value: 'file'
      },{
        label: 'Create line',
        value: 'line'
      }],
      script: {
        type: 'file',
        val: '',
      },
      selectScript: null,
      line: '',
      name: '',
      asstVisible: false,
    }
  },
  computed: {
    disableModify: function() {
      return !this.info.enable
    }
  },
  methods: {
    select: function() {
      this.listVisible = true
    },
    confirmSelect: function() {
      this.listVisible = false
      this.name = this.selectScript.name
      this.ifChanged()
    },
    create: function() {
      this.createVisible = true
    },
    typeChange: function(val) {
      if (val == 'file') {
        this.selectVisible = true
        this.createVisible = false
      } else if (val == 'line') {
        this.selectVisible = false
        this.createVisible = true
      }
      this.ifChanged()
    },
    handleClick: function(row,event,column) {
      console.log(row)
      this.selectScript = this._.cloneDeep(row)
    },

    cancel: function() {
      this.$emit('config-cancel')
    },
    confirm: function() {
      if (this.script.type == 'line') {
        this.script.val = this.line
      } else if (this.script.type == 'file') {
        this.script.val = this.name
      }
      this.$emit('config-confirm', this.script)
    },
    lineChange: function() {
      this.ifChanged()
    },
    ifChanged: function() {
      if (this.script.type == this.info.params.type) {
        if (this.script.type == 'line') {
          if (this.script.val == this.line) {
            this.$emit('config-change', false)
            return
          }
        } else if (this.script.type == 'file') {
          if (this.script.val == this.name) {
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
      this.line = this.line + ' ' + word
    },
  },
  mounted() {
    this.script = this._.cloneDeep(this.info.params)
    if (this.script.type == 'line') {
      this.line = this.info.params.val
    } else if (this.script.type == 'file') {
      this.name = this.info.params.val
    }
    this.typeChange(this.script.type)
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
.content .button {
  display: inline-block;
  text-align: right;
}
.content .type {
  width: 160px;
}
.select {
  margin-top: 20px;
  margin-left: 5px;
}
.select .name {
  display: inline-block;
  width: 160px;
}
.create {
  margin-top: 20px;
  margin-left: 5px;
}
.script-line {
  margin-top: 10px;
}
.script-line .el-input {
  width: 320px;
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
