<template>
  <div>
    <h3>选择函数</h3>
    <div class="content" :class="{disable: disableModify}">
      <div class="button">
        <el-button size="small" type="primary" @click="select">选择</el-button>
      </div>
      <div class="name">
        <span>函数： </span>
        {{fun.name}}
      </div>
      <div class="param" v-if="fun.name">
        输入参数：
        <div v-for="(o, index) in paramsHint" :key="index" class="item">
          <div class="hint">{{o.type}} {{o.name}} = </div>
          <el-input type="text" size="small" v-model="fun.params[index]" @change="inputChange"/>
        </div>
      </div>
      <div class="ret" v-if="fun.name">
        返回值:
        <el-select v-model="fun.ret" class="ret-var" size="small"
          placeholder="选择变量"
          @change="inputChange">
          <el-option
            v-for="item in vars"
            :key="item.name"
            :label="formatLabel(item)"
            :value="item.name"
          ></el-option>
        </el-select>
      </div>

      <div class="hint">
        {{expr}}
      </div>

    </div>

    <el-dialog title="选择函数" 
      :visible.sync="selectVisible">
      <ul class="fun-list">
        <div class="title">
          <div class="name">函数名</div>
          <div class="param">参数</div>
          <div class="desc">说明</div>
        </div>
        <li v-for="(o, index) in funs" :key="index"
          @click="selectFun(index)" class="item"
          :class="index==selectedIndex?'selected-item':''">
          <div class="name">{{o.name}}</div>
          <div class="params">
            <!-- 若无参数-->
            <div v-if="o.params.length==0">-</div>
            <div v-for="(p, i) in o.params" :key="i">
              {{p.type}}
              {{p.name}}
            </div>
          </div>
          <div class="comment">{{o.comment}}</div>
        </li>
      </ul>
      <div slot="footer">
        <el-button @click="selectVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmSelect">确定</el-button>
      </div>
    </el-dialog>
    <div class="confirm-field">
      <el-button @click="cancel">Cancel</el-button>
      <el-button type="primary" @click="confirm" :disabled="disableModify">Confirm</el-button>
    </div>
  </div>  
</template>

<script>
export default {
  props: ['info'],
  computed: {
    funs: function () {
      return this.$store.state.prog.funs
    },
    vars: function() {
      return this.$store.state.prog.vars
    },
  },
  data() {
    return {
      selectVisible: false,
      fun: {
        name: '',
        params: [],
        ret: ''
      },
      paramsHint: [],
      selectedIndex: -1,
      expr: ''
    }
  },
  computed: {
    disableModify: function() {
      return !this.info.enable
    }
  },
  methods: {
    formatLabel: function(o) {
      return `${o.name} ( ${o.type} )`
    },
    select: function() {
      this.selectVisible = true
    },
    selectFun: function(index) {
      this.selectedIndex = index
    },
    confirmSelect: function() {
      var i = this.selectedIndex
      if (i < 0) {
        return
      }
      this.fun.name = this.funs[i].name
      this.paramsHint = this._.cloneDeep(this.funs[i].params)
      // console.log(this._.cloneDeep(this.fun))
      this.selectVisible = false
      
      this.ifChanged()
    },
    cancel: function() {
      this.$emit('config-cancel')
    },
    confirm: function() {
      this.$emit('config-confirm', this.fun)
    },
    inputChange: function() {
      this.ifChanged()
    },
    ifChanged: function() {
      var ret = this._.isEqual(this.fun, this.info.params)
      if (ret) {
        this.$emit('config-change', false)
      } else {
        this.$emit('config-change', true)
      }
    }
  },
  mounted() {
    this.fun = this._.cloneDeep(this.info.params)
    
    if (!this.funs) return
    var name = this.fun.name
    var active = this.funs.filter((x)=>{ return x.name == name})
    if (active.length != 1) return
    this.paramsHint = active[0].params
  },
}
</script>

<style scoped>
.disable {
  pointer-events: none;
}
ul {
  margin: 0;
  padding: 0;
  list-style: none;
}
li {
  display: list-item;
}
.content {
  text-align: left;
}
.content .button {
  position: absolute;
  height: 50px;
  line-height: 50px;
  right: 50px;
}
.content .name {
  height: 50px;
  line-height: 50px;
}
.content .param {

}
.content .param .item {
  height: 40px;
  line-height: 40px;
  margin-left: 10px;
}
.param .hint {
  display: inline;
}
.param .el-input {
  display: inline-block;
  width: 100px;
  margin-left: 10px;
}
.content .ret {
  height: 50px;
  line-height: 50px;
}
.content .ret .el-input {
  width: 150px;
}
.fun-list {
  margin: 10px;
  text-align: left;
  font-size: 14px;
  color: #666;
}
.fun-list .title {
  height: 30px;
  border-bottom: 1px solid #aaa;
}
.fun-list .title .name {
  display: inline-block;
  width: 100px;
}
.fun-list .title .param {
  display: inline-block;
  width: 100px;
}
.fun-list .title .desc {
  display: inline-block;
  width: 150px;
}
.fun-list .item {
  padding: 5px 0 5px 0;
  vertical-align: middle;
}
.fun-list .selected-item {
  background-color: #e3e5e7;
}
.fun-list .item .name {
  display: inline-block;
  width: 100px;
}
.fun-list .item .params {
  display: inline-block;
  width: 100px;
  vertical-align: middle;
}
.fun-list .item .comment {
  display: inline-block;
  width: 150px;
}
.ret-var {
  width: 120px;
}
.hint {

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
