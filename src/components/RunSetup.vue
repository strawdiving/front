<template>
  <div class="container">
    <div>
      <i class="el-icon-arrow-right"></i>
    </div>
    <robot-model ref="robot" :jointRad="jointPosRad" :targetPos="startPoint"></robot-model>
    <div class="move" v-if="moveVisible">
      <el-button type="primary" @mousedown.native="moveStartPoint" @mouseup.native="moveStartRelease">按住移动</el-button>
    </div>
    <div>
      <el-button type="primary" @click="runProg">启动</el-button>
    </div>
    <!-- <el-col :span="14" class="robot">
      <robot-model ref="robot" :jointRad="jointPosRad" :targetPos="startPoint"></robot-model>
    </el-col> -->
    <!-- <el-col :span="10" class="prog-area">
      <div class="move" v-if="moveVisible">
        <el-button type="primary" @mousedown.native="moveStartPoint" @mouseup.native="moveStartRelease">按住移动</el-button>
      </div>
      <div>
        <el-button type="primary" @click="runProg">启动</el-button>
      </div>
    </el-col> -->
  </div>
</template>

<script>
import {getScripts, scriptTask, stopTask, moveTo} from '@/api/index'
import {TASK_STATE, SAFETY_MODE} from '@/constants/robot'
export default {
  data() {
    return {
      // 是否需要检查起始点
      checkStartPoint: true,
      programAxisMoveTo: [],
      xyzMoveTo: [],
      startPointMoveType: 0,

      moveVisible: false,
      startPoint: [],
    }
  },
  computed: {
    programRun(){
      return this.$store.state.status.progInfo.progRunning
    },
    jointPos() {
      var pos = []
      for (let i = 0; i < 7; i++) {
        let v = this.$store.state.status.fromPLC.jointInfo[i].actualPos
        pos.push(v)
      }
      return pos
    },
    jointPosRad() {
      // var pos = [];
      // for (let i = 0; i < 7; i++) {
      //   let v = this.$store.state.status.fromPLC.jointInfo[i].actualPos;
      //   pos.push(2 * Math.PI * v / 360);
      // }
      return this.jointPos.map((x) => { return 2 * Math.PI * x / 360 });
    },
    robotData() {
      return this.$store.state.status.fromPLC.fbRobotData
    },
    cordPos() {
      return this.$store.state.status.fromPLC.cartesianInfo.actPos
    },
    scriptArray() {
      let s = this.$store.state.script.script
      return s.trim().split('\n')
    },
    graphProg() {
      return this.$store.state.prog.progs
    },
    repeated() {
      return this.$store.state.script.repeated
    },
    repeatedTimes() {
      return this.$store.state.script.repeatedTimes
    }

  },
  watch: {
    // programRun: function (newVal, oldVal) {
    //   if (newVal && !oldVal) {
    //     this.startTimer()
    //   }
    //   if (!newVal && oldVal) {
    //     this.stopTimer()
    //     this.checkRepeat()
    //   }
    // },
  },
  methods: {
    checkStart(){
      if (this.robotData.taskState != TASK_STATE.idle && 
        this.robotData.taskState != TASK_STATE.pause) {
        return
      }
      if (this.robotData.safetyMode != SAFETY_MODE.normal && 
        this.robotData.safetyMode != SAFETY_MODE.reduceModeTriggered) {
        return
      }
      if (!this.programRun) {
        console.log('check...')
        // check if need to move to the start point manually
        if (!this.repeated && this.checkStartPoint &&(this.repeatedTimes === 0)) {
          var index = 0
          var line = this.scriptArray[index]
          var keyword = line.split('(')[0].trim()
          while (!['Start', 'MoveJ', 'MoveL', 'MoveC_1', 'movej', 'movel', 'movec', 'movec_1'].includes(keyword)) {
            if (index === this.scriptArray.length - 1) break
            line = this.scriptArray[++index]
            keyword = line.split('(')[0].trim()
          }
          if (['Start', 'MoveJ', 'MoveL', 'MoveC_1', 'movej'].includes(keyword)) {
            let para = []
            let pass = false
            if (keyword === 'movej') {
              para = line.split('([')[1].split('],')[0].split(',')
              if (para.length !== 7)  pass = true
            } else {
              para = line.split('(')[1].split(')')[0].split(',')
            }

            let variance = 0
            for (let i = 0; i < 7; i++) {
              if (keyword === 'movej') {
                variance += Math.abs(para[i] - this.jointPos[i])
              } else {
                variance += Math.abs(para[i + 8] - this.jointPos[i])
              }
            }

            if (variance > 1 && !pass) {
              if (keyword === 'movej') {
                for(let i = 0; i < 7; i++) this.programAxisMoveTo[i] = Number(para[i])
              } else {
                for(let i = 8; i < 15; i++) this.programAxisMoveTo[i - 8] = Number(para[i])
              }

              ///
              this.moveVisible = true
              this.startPointMoveType = 0
              this.startPoint = this.programAxisMoveTo
              console.log(this.programAxisMoveTo)
              return
            }
          }

          if (['movel', 'movec', 'movec_1'].includes(keyword)) {
            let para = []
            let pass = false
            para = line.split('([')[1].split('],')[0].split(',')
            if (para.length !== 6) pass = true

            let variance = 0
            for(let i = 0; i < 6; i++){
              variance += Math.abs(para[i] - this.cordPos[i])
            }
            if (variance > 1 && !pass) {
              for(let i = 0; i < 7; i++) this.xyzMoveTo[i] = Number(para[i])

              //
              this.moveVisible = true
              this.startPointMoveType = 1
              // this.startPoint = 
              console.log(this.xyzMoveTo)
              return
            }
          }
        }
      }
      this.moveVisible = false
      
      // this.updateProgStatus('RUN')
      this.checkStartPoint = true
      this.$refs['robot'].showTarget()
    },

    checkGraphStart() {
      var index = 1
      var self = this

      var ps = this._.cloneDeep(this.graphProg)
      ps.shift()

      handleLine(ps.shift(),function(find){
        console.log('handle line')
        if (find) {
          console.log('checked start point')
        } else {
          handleLine(ps.shift())
        }
      })

      function handleLine(l, callback) {
        if (l.type == 'action') {
          var actions = l.body
          console.log(actions)
          var move
          for (let i = 0; i < actions.length; i++) {
            if (actions[i].type == 'Move') {
              move = actions[i]
              console.log(move)
              break;
            }
          }
          if (move) {
            switch(move.params[0].type){
              case 'MoveJ':
                let variance = 0
                let para = move.params[0].pose
                for (let i = 0; i < 7; i++) {
                  variance += Math.abs(para[i] - self.jointPos[i])
                }
                if (variance > 1) {
                  self.startPointMoveType = 0
                  self.moveVisible = true
                  self.programAxisMoveTo = self._.cloneDeep(para)
                  console.log(self.programAxisMoveTo)
                }
                break;
              case 'MoveL':
              case 'MoveC':
                let variance2 = 0
                let para2 = move.params[0].pose
                for (let i = 0; i < 6; i++) {
                  variance2 += Math.abs(para2[i] - self.cordPos[i])
                }
                if (variance2 > 1) {
                  self.startPointMoveType = 1
                  self.moveVisible = true
                  self.xyzMoveTo = self._.cloneDeep(para2)
                  console.log(self.xyzMoveTo)
                }
                break;
              case 'tcp_Move':
                break;
              case 'Move_phi':
                break;
            }
            callback(true)
          }
        } else if (l.body){
          for (let i = 0; i < l.body.length; i++) {
            handleLine(l.body[i], callback)
          }
        } else {
          callback(false)
        }
      }
    },

    // 移动到启动点
    moveStartPoint() {
      if (this.startPointMoveType === 0) {
        moveTo(0, this.programAxisMoveTo, 80).then((res)=>{
          
        }).catch((err)=>{

        })
      } else if (this.startPointMoveType === 1) {
        moveTo(3, this.xyzMoveTo, 80).then((res)=>{

        }).catch((err)=>{

        })
      }
    },
    moveStartRelease() {
      stopTask()
    },

    runProg() {
      this.$emit('start')
    },

  },
  mounted() {
    console.log('setup mount')
    // this.checkStart()
  },
  components: {
  }
}
</script>

<style scoped>
*{
  box-sizing: border-box;
}
.container {
  width: 100%;
  height: 400px;
  padding: 20px 10px 10px 0px;
}
.container .robot {
  height: 90%;
}
.move {
  margin-top: 20px;
  margin-right: 50px;
}
.move button{
  /*height: 40px;*/
  width: 100px;
}
</style>


