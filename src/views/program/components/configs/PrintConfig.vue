<template>
  <div>
    <h3>显示变量值</h3>
    <div class="content" :class="{disable: disableModify}">
      <div class="button">
        <el-button type="primary" size="small" @click="addItem">添加</el-button>
      </div>
      <div class="item" v-for="(o, index) in list" :key="index">
        <el-select v-model="o.type" class="type-select" @change="inputChange">
          <el-option
            v-for="item in types"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>

        <el-select v-model="o.var" class="var-select" placeholder="选择变量" @change="inputChange">
          <el-option
            v-if="o.type=='i'||o.type=='f'"
            v-for="item in numVars"
            :key="item.name"
            :label="formatLabel(item)"
            :value="item.name"
          ></el-option>
          <el-option
            v-if="o.type=='s'"
            v-for="item in stringVars"
            :key="item.name"
            :label="formatLabel(item)"
            :value="item.name"
          ></el-option>
          <el-option
            v-if="o.type=='a'"
            v-for="item in arrayVars"
            :key="item.name"
            :label="formatLabel(item)"
            :value="item.name"
          ></el-option>
        </el-select>
        <el-button type="danger" size="small" @click="removeItem(index)">移除</el-button>
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
  props: ['info'],
  data() {
    return {
      types: [{
        value: 'i',
        label: 'print_i'
      },{
        value: 'f',
        label: 'print_f'
      },{
        value: 's',
        label: 'print_s'
      },{
        value: 'a',
        label: '打印数组'
      }],
      list: [],
    }
  },
  computed: {
    vars: function () {
      return this.$store.state.prog.vars
    },
    numVars: function() {
      return this.vars.filter(x=>x.type=="int"||x.type=="float")
    },
    stringVars: function() {
      return this.vars.filter(x=>x.type=="string")
    },
    arrayVars: function() {
      return this.vars.filter(x=>x.type=="array"||x.type=='pose')
    },
    disableModify: function() {
      return !this.info.enable
    }
  },
  methods: {
    formatLabel: function(o) {
      return `${o.name} ( ${o.type} )`
    },
    addItem: function() {
      var o = {
        type: '',
        var: '',
      }
      this.list.push(o)
      this.ifChanged()
    },
    removeItem: function(index) {
      this.list.splice(index, 1)
      this.ifChanged()
    },
    cancel: function() {
      this.$emit('config-cancel')
    },
    confirm: function() {
      this.$emit('config-confirm', this.list)
    },
    inputChange: function() {
      this.ifChanged()
    },
    ifChanged: function() {
      var ret = this._.isEqual(this.list, this.info.params)
      if (ret) {
        this.$emit('config-change', false)
      } else {
        this.$emit('config-change', true)
      }
    }
  },
  mounted() {
    this.list = this._.cloneDeep(this.info.params)
  },
}
</script>

<style scoped>
.disable {
  pointer-events: none;
}
.button {
  text-align: right;
  margin-right: 40px;
  height: 50px;
}
.item {
  text-align: left;
  height: 45px;
  padding: 0 20px;
}
.item .type-select {
  width: 120px;
}
.item .var-select {
  width: 180px;
}
.item .el-button {
  display: inline-block;
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
