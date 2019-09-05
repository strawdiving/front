<template>
  <div class="container">
    <el-col :span="14" class="prog-area">
      <div id="editField">
        <div class="control">
          <div v-if="!codeEditMode">
            <el-button @click="editCode" size="mini" type="primary">Edit</el-button>
          </div>
          <div v-if="codeEditMode">
            <el-button @click="undo" type="text" icon="el-icon-arrow-left">undo</el-button>
            <el-button @click="redo" type="text" icon="el-icon-arrow-right">redo</el-button>
            <el-button @click="saveCode" size="mini" type="primary">Save</el-button>
            <el-button @click="cancelCode" size="mini">Cancel</el-button>
          </div>
        </div>

        <textarea id="text-script"></textarea>
      </div>

      <div class="repeat">
        <el-radio-group v-model="repeatOpt" @change="optChange">
          <el-radio label="1"><label>单次</label></el-radio>
          <el-radio label="2"><label>无限重复</label></el-radio>
          <el-radio label="3"><label>重复次数： </label>
            <el-input-number size="small" :disabled="repeatOpt!='3'" :min="0" :max="99" v-model.number="repeatedTimes" @change="timesChange"></el-input-number>
          </el-radio>
        </el-radio-group>
      </div>
    </el-col>
      <!-- <div class="run-time">
        运行时间：
        <label>{{runTimeString}}</label> 
        <span class="program-status">运行状态：
          <label>{{programStatus}}</label>
        </span>
      </div> -->
  </div>
</template>

<script>
import * as CodeMirror from 'codemirror/lib/codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/monokai.css'
import 'codemirror/theme/darcula.css'
import 'codemirror/theme/eclipse.css'
import 'codemirror/addon/hint/show-hint.css'
import 'codemirror/mode/robot/robot'
import 'codemirror/mode/lua/lua'
import 'codemirror/mode/clike/clike'
import 'codemirror/addon/hint/show-hint'
export default {
  props:['mode'],
  data() {
    return {
      codeEditor: null,
      codeEditMode: false,
      codeSaved: '',
      repeatOpt: '1',
      runTimeString: '',
      programStatus: '',
      repeatedTimes: 0,
    }
  },
  computed: {
    programRun(){
      return this.$store.state.status.progInfo.progRunning
    },
    debugUpdate(){
      return this.$store.state.status.progInfo.printIndex
    },
    programLine() {
      return this.$store.state.status.progInfo.programLine
    },
    currentScript() {
      return this.$store.state.script.script
    },
    repeat() {
      return this.$store.state.script.repeat
    }
  },
  watch: {
    debugUpdate: function (newIndex, oldIndex) {
      this.debugMsg.push(this.$store.state.status.progInfo.printMsg)
    },
    programRun: function (newVal, oldVal) {
      // if (newVal && !oldVal) {
      //   this.startTimer()
      // }
      // if (!newVal && oldVal) {
      //   this.stopTimer()
      //   this.checkRepeat()
      // }
    },
    // programLine: function (newVal, oldVal){
    //   // 根据programLine确定滚动条位置
    //   this.$refs.showDiv.scrollTop = newVal * 30
    // }
  },
  methods: {
    //获取脚本文件内容
    requireScript(name) {
      let para = {
        name:name
      }
      this.contentLoading = true
      readScript(para).then((res) => {
        this.contentLoading = false
        this.script = res.data.content
        // console.log(this.script)
        this.scriptContent = this.script.trim().split('\n')
        // console.log(this.scriptContent)
        this.updateProgStatus('READY')
      }).catch((err) => {
        this.$message.error('打开脚本错误')
      })
    },
    //格式化时间显示
    showTimeString(timeMs){
      var temp = parseInt(timeMs / 1000)
      var ms = timeMs % 1000
      var seconds = temp % 60
      var minutes = parseInt(temp / 60)
      if (minutes === 0) {
        this.runTimeString = seconds + "." + ms + "s"
      } else {
        this.runTimeString = minutes + "m " + seconds + "." + ms + "s"
      }
      console.log(this.runTimeString)
    },
    updateProgStatus(state) {
      switch (state) {
        case 'READY':
          this.programStatus = '就绪'
          break
        case 'RUN':
          this.programStatus = '运行中'
          break
        case 'PAUSE':
          this.programStatus = '暂停'
          break
        case 'STEP':
          this.programStatus = '单步运行'
          break
      }
    },
    // checkRepeat() {
    //   if (this.repeated) {
    //     if (this.repeatedTimes > 0) {
    //       this.runProgram()
    //       this.repeatedTimes--
    //     } else if (this.repeatedTimes < 0) {
    //       this.runProgram()
    //     } else if (this.repeatedTimes === 0) {
    //       this.repeated = false
    //     }
    //   }
    // },
    optChange: function(val) {
      switch (val) {
        case '1':
          this.$store.commit('setRepeated', {repeated: false, times: 1})
          break;
        case '2':
          this.$store.commit('setRepeated', {repeated: true, times: -1})
          break;
        case '3':
          this.$store.commit('setRepeated', {repeated: true, times: this.repeatedTimes})
          break;
        default:
          break;
      }
    },
    timesChange: function(val) {
      console.log(val)
      this.$store.commit('setRepeated', {repeated: true, times: val})
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
      this.$store.commit('update', msg)
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
    showCode: function() {
      let myTextarea = document.getElementById('text-script');
      this.codeEditor = CodeMirror.fromTextArea(myTextarea, {
        mode:'text/x-csrc',//编辑器语言
        theme:'monokai', //编辑器主题
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
    let content = this.currentScript
    if (this.repeat.repeated) {
      if (this.repeat.times < 0) {
        this.repeatOpt = '2'
      } else {
        this.repeatOpt = '3'
      }
    } else {
      this.repeatOpt = '1'
    }
    this.repeatedTimes = this.repeat.times
    
    this.$nextTick(() => {
      this.codeEditor.refresh()
      this.codeEditor.setValue(content)
    })
  }
}
</script>

<style scoped>
.container {
  position: absolute;
  top: 0;
  bottom: 50px;
  left: 0;
  right: 0;
  background: #fff;
}
.prog-area {
  padding: 10px;
}
.prog-area .repeat {
  text-align: left;
  height: 50px;
  line-height: 50px;
  padding-left: 10px;
}
#editField {
  text-align: left;
  margin: 10px;
  height: 95%;
}
#editField .control {
  text-align: right;
  height: 40px;
  line-height: 40px;
}
#text-script {
  height: 95%;
}
.run-time {
  height: 40px;
  text-align: left;
  vertical-align: middle;
  margin-top: 20px;
}
.run-time label {
  color: #409EFF;
}
.program-status {
  margin-right: 10%;
  float: right;
}
.button-group {
  text-align: right;
  padding-right: 10px;
}
.run-btn {
  margin-top: 40px;
}
.repeat-input input {
  width: 30%;
  margin: 0 0 20px 10px;
}
</style>

