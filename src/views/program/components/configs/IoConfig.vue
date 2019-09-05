<template>
  <div>
    <h3>设定IO口状态</h3>
    <div class="content" :class="{disable: disableModify}">
      <div class="button">
        <el-button type="primary" size="small" @click="addIo">添加</el-button>
        <el-button type="danger" size="small" @click="removeIo">移除</el-button>
      </div>
      <div class="item-title">
        <span class="type">IO类型</span>
        <span class="port">端口号</span>
        <span class="val">值</span>
      </div>
      <div class="item" v-for="(o, index) in outputs" :key="index">
        <el-select v-model="o.type" class="type-select" @change="typeChange(index)">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <!-- el-input-number组件bug:不能使用v-model=o.port，间接定义一个新的变量port完成相关功能-->
        <el-input-number class="port" v-model="port[index]" size="medium"
          :min="1" :max="maxPort(o.type)">
        </el-input-number>

        <!-- <input class="port" type="number" v-model="o.port"/> -->
        <div :class="o.val?'icon-highlight':'icon-grey'" 
            class="icon" 
            @click="o.val=!o.val">
        </div>
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
      port: [],

      options:[{
        value: 'base',
        label: 'IO',
        max: 14,
      },{
        value: 'tool',
        label: '工具IO',
        max: 2,
      }],

      outputs: [{
        type: 'base',
        port: 1,
        val: false,
      },],
    }
  },
  computed: {
    disableModify: function() {
      return !this.info.enable
    }
  },
  methods: {
    addIo: function() {
      var o = {
        type: 'base',
        port: 0,
        val: false,
      }
      this.outputs.push(o)
      this.port.push(1)
    },
    removeIo: function() {
      this.outputs.pop()
    },
    maxPort: function(type) {
      if (type == 'base') {
        return 14
      } else if (type == 'tool') {
        return 2
      }
    },
    cancel: function() {
      this.$emit('config-cancel')
    },
    confirm: function() {
      for (let i = 0; i < this.outputs.length; i++) {
        this.outputs[i].port = this.port[i]
      }
      this.$emit('config-confirm', this.outputs)
    },
    typeChange: function(index) {
      var o = this.outputs[index]
      // 当io类型发生变化时，port端口的值进行调整
      // 工具io端口范围1~2
      if (o.type=='tool') {
        if (this.port[index]>2) {
          this.port[index] = 2
        }
      }
    }
  },
  mounted() {
    this.outputs = this._.cloneDeep(this.info.params)
    var len = this.outputs.length
    this.port = new Array(len)
    for (let i = 0; i < len; i++) {
      this.port[i] = this.outputs[i].port      
    }
    
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
.item-title {
  text-align: left;
  height: 30px;
  font-size: 15px;
  font-weight: 500;
}
.item-title .type {
  display: inline-block;
  width: 100px;
  margin-left: 20px;
}
.item-title .port {
  display: inline-block;
  width: 100px;
  margin-left: 50px;
}
.item-title .val {
  display: inline-block;
  margin-left: 50px;
}
.item {
  text-align: left;
  height: 40px;
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
.item .type-select {
  width: 100px;
}
.item .port {
  width: 130px;
  margin-left: 40px;
}
.icon {
  margin-left: 50px;
  width: 16px;
  height: 16px;
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
</style>
