<template>
  <div>
    <el-tabs tab-position="left" id="field" @tab-click="clickTab">
      <el-tab-pane label="内置函数" name='1'>
        <div class="fun-group" v-for="(o,key,index) in builtin" :key="index">
          <span class="tree-expand" :class="o.expand?'group-open':'group-close'"
            @click="expandGroup(o)"></span>
          {{key}}
          <el-collapse-transition>
            <div v-if="o.expand">
              <div class="item fun-item" v-for="(o2,k,j) in o.items" :key="j" 
                :class="selectWord==k?'item-select':''"
                @click="selectItem(key, k)"
                @dblclick="inputItem(k)">
                {{k}}
              </div>
            </div>
          </el-collapse-transition>         
        </div>
      </el-tab-pane>
      <el-tab-pane label="变量" name='2'>
        <div v-if="vars && vars.length>0">    
          <div class="item" v-for="(o,index) in vars" :key="index"
            :class="selectWord==o.name?'item-select':''"
            @click="selectItem2(o.name)"
            @dblclick="inputItem2(o.name)">
            {{o.name}}
          </div>
        </div>
      </el-tab-pane>
      <!-- <el-tab-pane label="输入输出" name="3">
        <div class="item" v-for="(o,index) in funs" :key="index">
          <span>{{o.name}}</span>
          <span>{{o.comment}}</span>
        </div>
      </el-tab-pane>
      <el-tab-pane label="Modbus" name="4">
        <div class="item" v-for="(o,index) in modbusList" :key="index">
          {{o.name}}
        </div>
      </el-tab-pane> -->
      <el-tab-pane label="关键字&运算符" name="3">
        <div v-if="keywords">
          <div v-for="(o,key,index) in keywords" :key="index">
            <div class="item" v-for="(o2,j) in o" :key="j"
              :class="selectWord==o2?'item-select':''"
              @click="selectItem2(o2)"
              @dblclick="inputItem2(o2)">
              {{o2}}
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
    <div id="desc">
      <div v-if="tabIndex=='1' && selectWord && group">
        <div class="expr">{{funExpr}}</div>
        <span class="title">函数说明：</span>
        <div class="info">
          {{builtin[group].items[selectWord].desc}}
        </div>
        <span class="title">参数说明：</span>
        <div class="info">
          <div v-for="(o, key, index) in builtin[group].items[selectWord].param" :key="index">
            {{key}}: {{o.desc}}
          </div>
        </div>
        <span class="title">返回值：</span>
        <div class="info">
          <div v-if="builtin[group].items[selectWord].ret">
            {{builtin[group].items[selectWord].ret.type}}, {{builtin[group].items[selectWord].ret.desc}}
          </div>
          <div v-else>无</div>
        </div>
      </div>
      <div v-else-if="tabIndex=='2'">
        <div>类型: </div>
      </div>
    </div>
  </div>
</template>
<script>
import { keywords, builtin } from './inputHint.js'
export default {
  computed: {
    vars: function() {
      return this.$store.state.prog.vars
    },
    funs: function() {
      return this.$store.state.prog.funs
    },
    // modbusList: function() {
    //   return this.$store.state.config.modbusList
    // },
    funExpr: function() {
      var p = this.builtin[this.group].items[this.selectWord].param
      if (!p) return ''
      var s = []
      for (const key in p) {
        s.push(`${p[key].type}: ${key}`)
      }
      return `${this.selectWord} (${s.join(', ')});`
    }
  },
  data() {
    return {
      builtin: null,
      keywords: null,
      select: {
        group: '',
        item: '',
      },
      selectWord: '',
      group: '',
      tabIndex: 1,
    }
  },
  methods: {
    selectItem: function(group, word) {
      this.group = group
      this.selectWord = word
    },
    inputItem: function(word) {
      this.$emit('input-word', word +'( )')
    },
    expandGroup: function(o) {
      o.expand = !o.expand
    },
    selectItem2: function(word) {
      this.selectWord = word
    },
    inputItem2: function(word) {
      this.$emit('input-word', word)
    },
    clickTab: function(o) {
      this.tabIndex = o.name
    }
  },
  mounted() {
    this.builtin = builtin
    this.keywords = keywords
  },
}
</script>
<style scoped>
#field {
  height: 260px;
  text-align: left;
  border: 1px solid #aaa;
  border-radius: 4px;
}
.el-tab-pane {
  height: 260px;
  overflow: auto;
}
.tree-expand {
  display: inline-block;
  width: 14px;
  height: 14px;
  text-align: center;
  line-height: 13px;
  border: 1px solid #888;
  border-radius: 2px;
  background: #fff;
  font-style: normal;
  cursor: pointer;
}
.group-open::after {
  content: "\2013";
}
.group-close::after {
  content: "+";
}
.fun-item {
  padding-left: 20px;
  position: relative;
}
.fun-item::before {
  content: ' ';
  position: absolute;
  width: 1px;
  left: 8px;
  bottom: 50px;
  top: -8px;
  right: auto;
  height: 30px;
  border-left: 1px dashed #aaa;
}
.fun-item::after {
  content: ' ';
  position: absolute;
  width: 10px;
  height: 1px;
  top: 14px;
  left: 8px;
  border-top: 1px dashed #aaa;
}
.fun-item:first-child::before {
  top: 0px;
}
.fun-item:last-child::before {
  height: 20px;
}
.item {
  width: 200px;
  height: 30px;
  font-weight: 600;
  line-height: 30px;
  cursor: pointer;
}
.item-select {
  background: rgb(182, 195, 247);
}
#desc {
  height: 80px;
  border: 1px solid #aaa;
  border-radius: 4px;
  margin-top: 10px;
  overflow: auto;
  padding: 2px 5px 2px 5px;
  text-align: left;
}
#desc .expr {
  margin-bottom: 3px;
}
#desc .title {
  font-weight: 600;
}
#desc .info {
  padding-left: 2em;
}
</style>
