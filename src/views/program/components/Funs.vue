<template>
  <div class="container">
    <div class="title-field">
      <div>
        <div class="title">Functions</div>
      </div>
      <el-button type="primary" @click="createFun">新建</el-button>
    </div>
    <div>
      <ul class="fun-list">
        <div class="title">
          <div class="name">函数名</div>
          <div class="param">参数</div>
          <div class="desc">说明</div>
          <div class="operate">操作</div>
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
          <div class="operate">
            <!-- <i class="el-icon-view" @click="showFun(index)"></i> -->
            <i class="el-icon-edit" @click="editFun(index)"></i>
            <i class="el-icon-delete" @click="deleteFun(index)"></i>
          </div>
        </li>
      </ul>
    </div>

    <div id="editField" v-show="show">
      <div class="control">
        <div v-if="codeEditMode">
          <el-button @click="undo" type="text" icon="el-icon-arrow-left">undo</el-button>
          <el-button @click="redo" type="text" icon="el-icon-arrow-right">redo</el-button>
          <el-button @click="saveCode" size="mini" type="primary">Save</el-button>
          <el-button @click="cancelCode" size="mini">Cancel</el-button>
        </div>
        <!-- <el-button v-else @click="editCode" size="mini" type="primary">Edit</el-button> -->
      </div>

      <textarea id="code"></textarea>
    </div>

    <el-dialog :title="funTitle" :visible.sync="addVisible" width="50%" class="create"
      :close-on-click-modal="false">
      <el-form :model="funModel" :rules="rule" ref="form">
        <el-form-item label="函数名" prop="name" class="name">
          <el-input v-model="funModel.name"></el-input>
        </el-form-item>
        <el-form-item label="参数" prop="param" class="param">
          <div class="param-operate">
            <i class="el-icon-plus" @click="addNewParam" title="add"></i>
            <i class="el-icon-delete" @click="deleteLastParam" title="delete"></i>
          </div>
          <div v-for="(o, index) in funModel.params" :key="index" class="param-item">
            <el-select v-model="o.type">
              <el-option
                v-for="item in paramOptions"
                :key="item"
                :value="item">
              </el-option>
            </el-select>
            <el-input v-model="o.name"></el-input>
          </div>
        </el-form-item>
        <el-form-item label="注释" prop="comment" class="comment">
          <el-input type="textarea" v-model="funModel.comment"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="cancelCreate">取消</el-button>
          <el-button v-if="dialogMode=='add'" type="primary" @click="confirmCreate">创建</el-button>
          <el-button v-if="dialogMode=='edit'" type="primary" @click="confirmEdit">下一步</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { idReg, keyReg, varReg } from '@/utils/wordReg'
import * as CodeMirror from 'codemirror/lib/codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/monokai.css'
import 'codemirror/theme/darcula.css'
import 'codemirror/theme/eclipse.css'
import 'codemirror/addon/hint/show-hint.css'
import 'codemirror/mode/robot/robot'
import 'codemirror/addon/hint/show-hint'
import 'codemirror/addon/hint/javascript-hint'
export default {
  data() {
    var checkName = (rule, value, callback) => {
      if (value.match(idReg)) {
        if (value.match(keyReg) || value.match(varReg)) {
          callback(new Error("不能与关键词或内部函数同名"))
        } else {
          var names = this.funs.map((o)=>{return o.name})
          if (names.includes(value)) {
            callback(new Error("变量名重复"))
          } else {
            callback()
          }
        }
      } else {
        callback(new Error("函数名不合法"))
      }
    }
    return {
      dialogMode: 'add',
      addVisible: false,
      funModel: {
        name: '',
        params: [],
        body: '',
        comment: ''
      },
      paramOptions: ['int', 'float', 'string', 'pose', 'array'],
      codeEditMode: false,
      codeEditor: null,

      //已经保存的代码
      codeSaved: '',
      selectedIndex: -1,
      rule: {
        name: [
          {required: true, message: '不能为空'},
          {validator: checkName, trigger: 'blur'}
        ]
      },
      show: false,
    }
  },
  computed: {
    funs: function() {
      return this.$store.state.prog.funs
    },
    funTitle: function() {
      if (this.dialogMode == 'edit') {
        return '编辑函数'
      } else if (this.dialogMode == 'add') {
        return '新建函数'
      }
    }
  },
  methods: {
    init: function() {
      this.resetFunModel()
      this.codeSaved = ''
      if (this.codeEditor) {
        this.codeEditor.setValue('')
      }
    },
    createFun: function() {
      this.dialogMode = 'add'
      this.addVisible = true
      this.resetFunModel()
    },
    confirmCreate: function() {
      this.$refs['form'].validate((valid)=>{
        if (valid) {
          this.addVisible = false
          this.$store.commit('createFun', this.funModel)
        } else {
          return false
        }
      })
    },
    cancelCreate: function() {
      this.addVisible = false
    },
    cancel: function() {
      this.addVisible = false
    },
    showFun: function(fun) {
      // this.selectedIndex = index
      // var fun = this.funs[index]
      if (!fun) return
      var p = fun.params.map(o=>{
        return `${o.type}:${o.name}`
      })

      var ps = p.join(',')
      var init = `# ${fun.comment}\ndef ${fun.name}(${ps}):\n\t${fun.body}\nend`
      this.codeEditor.setValue(init)
    },
    editFun: function(index) {
      this.dialogMode = 'edit'
      this.addVisible = true

      this.funModel = this._.cloneDeep(this.funs[index])
    },
    deleteFun: function(index) {
      this.$confirm('确定删除该函数？','提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        this.$store.commit('deleteFun', {index: index})
      }).catch(() => {

      }) 
    },
    selectFun: function(index) {
      this.selectedIndex = index
      var fun = this.funs[index]
      this.showFun(fun)
      this.show = true
    },
    // 添加函数参数
    addNewParam: function() {
      var o = {
        type: '',
        name: '',
      }
      this.funModel.params.push(o)
    },
    // 删除新添加的参数
    deleteLastParam: function() {
      this.funModel.params.pop()
    },
    confirmEdit: function() {
      this.showFun(this.funModel)

      this.codeEditMode = true
      this.enterEditMode()
      this.addVisible = false
    },
    redo: function() {
      this.codeEditor.redo()
    },
    undo: function() {
      this.codeEditor.undo()
    },
    saveCode: function() {
      this.codeEditMode = false
      this.exitEditMode()
      this.codeSaved = this.codeEditor.getValue()
      this.codeEditor.clearHistory()

      // 通过正则表达式截取函数体的内容
      var re = /[\#.*\n]*def .*\)\:([\s\S]*)end/g
      var f = re.exec(this.codeSaved.trim())
      if(!f) {
        this.$message('请检查格式是否正确')
        return
      }
      // console.log(f)
      // console.log(f[1].trim())
      // var fun = this.funs[this.selectedIndex]
      this.funModel.body = f[1].trim()

      var msg = Object.assign({},this.funModel,{index: this.selectedIndex})
      this.$store.commit('updateFun', msg)
    },
    cancelCode: function() {
      if (this.codeEditor.isClean()) {
        this.codeEditMode = false
        this.exitEditMode()
        return
      }
      this.$confirm('此操作会丢失当前未保存的内容，是否继续','警告',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(()=>{
        this.codeEditMode = false
        this.codeEditor.setValue(this.codeSaved)
        this.exitEditMode()
      }).catch(()=>{

      })
    },
    editCode: function() {
      this.codeEditMode = true
      this.enterEditMode()
    },
    enterEditMode: function() {
      this.codeEditor.setOption("readOnly", false)
      this.codeEditor.markClean()
    },
    exitEditMode: function() {
      this.codeEditor.setOption("readOnly", 'nocursor')
    },
    resetFunModel: function() {
      this.funModel.name = ''
      this.funModel.params = []
      this.funModel.body = ''
      this.funModel.comment = ''
    },

    showCode: function() {
      let myTextarea = document.getElementById('code');
      this.codeEditor = CodeMirror.fromTextArea(myTextarea, {
        mode:'robot',//编辑器语言
        theme:'eclipse', //编辑器主题
        extraKeys: {"Ctrl": "autocomplete"},//ctrl可以弹出选择项 
        lineNumbers: true, //显示行号
        lineWrapping: true, //代码折叠
        matchBrackets: true, //括号匹配
        smartIndent: true,  //自动缩进
        readOnly: 'nocursor'
      })
    }

  },
  mounted() {
    this.showCode()
    this.$nextTick(() => {
      this.codeEditor.refresh()
    })
  },
}
</script>
<style scoped>
.container {
  padding: 0 10px;
}
ul {
  margin: 0;
  padding: 0;
  list-style: none;
}
li {
  display: list-item;
}
.title-field {
  text-align: left;
  padding: 0 10px 0 10px;
  height: 60px;
}
.title-field .title {
  font-size: 24px;
}
.title-field .el-button {
  float: right;
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
  color: #999;
  font-weight: 600;
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
.fun-list .title .operate {
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
.fun-list .item .operate {
  display: inline-block;
  width: 100px;
}
.fun-list .item .operate i{
  font-size: 16px;
  width: 30px;
}
#editField {
  text-align: left;
  margin: 10px;
}
#editField .control {
  text-align: right;
  height: 40px;
}
.create .param-operate {
  text-align: right;
  margin-right: 80px;
}
.create .param-operate i{
  font-size: 18px;
  width: 30px;
}
.create .param {
  text-align: left;
}
.create .param-item .el-select {
  width: 100px;
}
.create .param-item .el-input {
  width: 120px;
}
</style>
