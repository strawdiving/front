<template>
  <div>
    <h3>设定Modbus节点</h3>
    <div class="content" :class="{disable: disableModify}">
      <div class="out">
        <div class="title">
          <div :class="type=='o'?'icon-highlight':'icon-grey'"
            class="icon"
            @click="selectOpt('o')">
          </div>
          输出节点设定
        </div>
        <div class="button">
          <el-button type="primary" size="small" @click="addOut" :disabled="type=='i'">添加</el-button>
          <el-button type="danger" size="small" @click="removeOut" :disabled="type=='i'">移除</el-button>
        </div>
        <div class="item" v-for="(o, index) in outputs" :key="index">
          <el-select v-model="o.name" class="name-select" placeholder="选择节点"
            @change="typeChange(index)" :disabled="type=='i'">
            <el-option
              v-for="item in outNames"
              :key="item.name"
              :label="item.name"
              :value="item.name">
            </el-option>
          </el-select>
          
          <div class="val">
            <div v-if="o.type==3">
              <el-input v-model="value[index]" size="small" class="value-input" placeholder="输出值"
                @change="inputChange">
                <template slot="prepend" v-if="prefix">0x</template>
              </el-input>
              <div class="hint">范围: {{inputHint}}</div>
            </div>
            <el-select v-if="o.type==1" class="do-val" v-model="o.val" placeholder="输出值"
              @change="valChange">
              <el-option
                v-for="(item, index) in doOpts"
                :key="item"
                :label="item"
                :value="index">
              </el-option>
            </el-select>
          </div>

        </div>
        <div class="show-mode">
          <el-checkbox v-model="checkHex" @change="hexChange"></el-checkbox>
          显示十六进制
        </div>
      </div>

      <div class="in">
        <div class="title">
          <div :class="type=='i'?'icon-highlight':'icon-grey'"
            class="icon"
            @click="selectOpt('i')">
          </div>
          输入节点设定
        </div>
        <div v-for="(o, index) in inputs" :key="index" class="in-item">
          <el-select class="var-select" placeholder="选择变量" v-model="o.var" :disabled="type=='o'">
            <el-option
              v-for="item in vars"
              :key="item.name"
              :label="item.name"
              :value="item.name">
            </el-option>
          </el-select>

          <el-select class="name-select" placeholder="选择节点" v-model="o.name" :disabled="type=='o'">
            <el-option  
              v-for="item in inNames"
              :key="item.name"
              :label="item.name"
              :value="item.name">
            </el-option>
          </el-select>
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
import {hex2dec, dec2hex} from '@/utils/util'
export default {
  props: ['info'],
  data() {
    return {      
      outputs: [{
        name: '',
        type: 0,
        val: 0,
      },],
      value: [0],
      doOpts: ['LOW','HIGH'],
      checkHex: false,
      inputHint: '-32768~32767',
      prefix: false,
      type: 'o',
      inputs: [{
        name: '',
        type: 1,
        val: '',
      }]
    }
  },
  computed: {
    modbusList: function() {
      return this.$store.state.config.modbusList
    },
    outNames: function() {
      return this.modbusList.filter((x)=>{
        return x.type == 1 || x.type == 3 
      })
    },
    disableModify: function() {
      return !this.info.enable
    },
    vars: function() {
      var s = this.$store.state.prog.vars
      return s.filter((x)=>{return x.type=='int'})
    },
    inNames: function() {
      return this.modbusList.filter((x)=>{
        return x.type == 0 || x.type == 2 
      }) 
    }
  },
  methods: {
    selectOpt: function(opt) {
      this.type = opt
      this.ifChanged()
    },
    addOut: function() {
      var o = {
        name: '',
        val: null,
      }
      this.outputs.push(o)
      this.ifChanged()
    },
    removeOut: function() {
      this.outputs.pop()
      this.ifChanged()
    },
    cancel: function() {
      this.$emit('config-cancel')
    },
    confirm: function() {
      if (this.type == 'o') {
        for (let i = 0; i < this.outputs.length; i++) {
          var o = this.outputs[i]
          if (o.type == 3) {
            if (this.checkHex) {
              o.val = hex2dec('0x'+this.value[i])
            } else {
              o.val = this.value[i]
            }
          }        
        }
        this.$emit('config-confirm', { type: 'o', v: this.outputs })
      } else if (this.type == 'i') {

        this.$emit('config-confirm', { type: 'i', v: this.inputs })
      }
    },
    typeChange: function(index) {
      var name = this.outputs[index].name
      var res = this.modbusList.filter((ele)=>{
        return ele.name == name
      })

      this.outputs[index].type = res[0].type
      // console.log(this.outputs)
      this.ifChanged()
    },
    hexChange: function(val) {
      if (val) {
        this.inputHint = '0x0000~0xFFFF'
        this.value = this.value.map(x=>{return dec2hex(Number(x))})
        this.prefix = true
      } else {
        this.inputHint = '-32768~32767'
        this.value = this.value.map(x=>{return hex2dec('0x'+x)})
        this.prefix = false
      }
    },
    ifChanged: function() {
      if (this._.isEqual(this.outputs, this.info.params)) {
        this.$emit('config-change', false)
        return
      }
      this.$emit('config-change', true)
    },
    inputChange: function() {
      this.ifChanged()
    },
    valChange: function() {
      this.ifChanged()
    }
  },
  mounted() {
    this.type = this.info.params.type
    if (this.type == 'o') {
      this.outputs = this._.cloneDeep(this.info.params.v)
    } else if (this.type == 'i') {
      this.inputs = this._.cloneDeep(this.info.params.v)
    }

    this.value = this.outputs.map((x)=>{return x.val})
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
.title {
  margin-bottom: 15px;
}
.button {
  text-align: right;
  margin-right: 40px;
  height: 50px;
}
.item {
  text-align: left;
  height: 50px;
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
.item .name-select {
  width: 140px;
  vertical-align: top;
}
.item .val {
  display: inline-block;
  margin-left: 40px;
  width: 140px;
}
.val .hint {
  font-size: 12px;
  color: #888;
}
.in-item {

}
.in-item .var-select {
  width: 140px;
}
.in-item .name-select {
  width: 140px;
}
.show-mode {
  text-align: right;
  margin-right: 24px;
  font-size: 13px;
  color: #666;
}
.el-input-group__prepend {
  padding: 0 10px;
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
</style>
