<template>
  <div class="container">
    <div class="title-field">
      <div>
        <div class="title">Segments</div>
      </div>
      <el-button type="primary" @click="create">新建</el-button>
    </div>

    <div>
      <ul class="seg-list">
        <div class="title">
          <div class="name">脚本名</div>
          <div class="desc">说明</div>
          <div class="operate">操作</div>
        </div>
        <li v-for="(o, index) in segs" :key="index"
          @click="selectSeg(index)" class="item"
          :class="index==selectedIndex?'selected-item':''">
          <div class="name">{{o.name}}</div>
          <div class="comment">{{o.comment}}</div>
          <div class="operate">
            <!-- <i class="el-icon-view" @click="showFun(index)"></i> -->
            <i class="el-icon-edit" @click="editSeg(index)"></i>
            <i class="el-icon-delete" @click="deleteSeg(index)"></i>
          </div>
        </li>
      </ul>
    </div>
 
    <div id="editField">
      <div class="control">
        <div v-if="codeEditMode">
          <el-button @click="undo" type="text" icon="el-icon-arrow-left">undo</el-button>
          <el-button @click="redo" type="text" icon="el-icon-arrow-right">redo</el-button>
          <el-button @click="saveCode" size="mini" type="primary">Save</el-button>
          <el-button @click="cancelCode" size="mini">Cancel</el-button>
        </div>
        <!-- <el-button v-else @click="editCode" size="mini" type="primary">Edit</el-button> -->
      </div>

      <textarea id="seg"></textarea>
    </div>

    <el-dialog id="create" title="新建脚本" :visible.sync="addVisible" width="40%">
      <el-form :model="newSeg" :rules="rule" ref="form">
        <el-form-item label="脚本名" prop="name" label-width="100px">
          <el-input v-model="newSeg.name"></el-input>
        </el-form-item>
        <el-form-item label="说明" label-width="100px">
          <el-input type="textarea" v-model="newSeg.desc"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="addVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmCreate">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { idReg} from '@/utils/wordReg'
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
  computed: {
    segs: function () {
      return this.$store.state.prog.segments
    }
  },
  data() {
    var checkName = (rule, value, callback) => {
      if (value.match(idReg)) {
        // 判断是否名字重复
        var s = this.$store.state.prog.segments
        var names = s.map((o)=>{ return o.name })
        if (names.includes(value)) {
          callback(new Error("脚本名重复"))
        } else {
          callback()
        }
      } else {
        callback(new Error("脚本名不合法"))
      }
    }
    return {
      addVisible: false,
      newSeg: {
        name: '',
        body: '',
        desc: '',
      },
      selectedIndex: -1,
      codeEditMode: false,
      codeEditor: null,
      codeSaved: '',
      rule: {
        name: [
          {required: true, message: '不能为空'},
          {validator: checkName, trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    init: function() {
      this.resetSeg()
      this.codeSaved = ''
      if (this.codeEditor) {
        this.codeEditor.setValue('')
      }
    },
    create: function() {
      this.addVisible = true
      this.resetSeg()
    },
    selectSeg: function(index) {
      this.showSeg(index)
    },
    editSeg: function(index) {
      this.editCode()
    },
    deleteSeg: function(index) {
      this.$confirm('确定删除该脚本？','提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        this.$store.commit('deleteSegment', {index: index})
      }).catch(() => {

      }) 
    },
    showSeg: function(index) {
      this.selectedIndex = index
      var seg = this.segs[index]
      this.codeEditor.setValue(seg.body)
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

      var seg = this.segs[this.selectedIndex]
      
      seg.body = this.codeSaved

      var msg = Object.assign({}, seg, {index: this.selectedIndex})
      this.$store.commit('updateSegment', msg)
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

    confirmCreate: function() {
      this.$refs['form'].validate((valid)=>{
        if (valid) {
          this.$store.commit('createSegment', this.newSeg)
          this.addVisible = false
        } else {
          return false
        }
      })
    },
    resetSeg: function() {
      this.newSeg.name = ''
      this.newSeg.body = ''
      this.newSeg.desc = ''
    },

    showCode: function() {
      let myTextarea = document.getElementById('seg');
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
  beforeDestroy() {
    // clean
    // const ele = this.codeEditor.doc.cm.getWrapperElement()
    // console.log(this.codeEditor)
    // ele && ele.remove && ele.remove()
  }
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

.seg-list {
  margin: 10px;
  text-align: left;
  font-size: 14px;
  color: #666;
}
.seg-list .title {
  height: 30px;
  border-bottom: 1px solid #aaa;
  color: #999;
  font-weight: 600;
}
.seg-list .title .name {
  display: inline-block;
  width: 100px;
}
.seg-list .title .desc {
  display: inline-block;
  width: 150px;
}
.seg-list .title .operate {
  display: inline-block;
  width: 150px;
}
.seg-list .item {
  padding: 5px 0 5px 0;
  vertical-align: middle;
}
.seg-list .selected-item {
  background-color: #e3e5e7;
}
.seg-list .item .name {
  display: inline-block;
  width: 100px;
}
.seg-list .item .comment {
  display: inline-block;
  width: 150px;
}
.seg-list .item .operate {
  display: inline-block;
  width: 100px;
}
.seg-list .item .operate i{
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
#info {
  text-align: left;
}
#code {
  text-align: left;
  margin: 0;
}

</style>
