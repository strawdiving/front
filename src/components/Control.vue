<template>
  <div class="container">
    <el-col :span="modelSpan" :class="mode=='jog'? 'robot':'robot-only'">
      <robot-model :jointRad="jointPosRad"></robot-model>
    </el-col>
    <el-col :span="12" class="jog" v-if="mode=='jog'">
      <jog :speed="speed"></jog>
    </el-col>
    <div class="button" v-if="mode=='jog'">
      <!-- <el-button @click="recordPos">记录该点</el-button> -->
      <el-button type="primary" @mousedown.native="moveInit" @mouseup.native="stop">归零</el-button>
      <el-button @click="enableHotkey">{{keyText}}</el-button>
    </div>
  </div>    
</template>

<script>
import Jog from '@/components/Jog'
import {stopTask, moveInit} from '@/api/index'
import {jogAxis, jogLine, jogPsi} from '@/api/index'
export default {
  props: {
    speed: {
      type: Number,
      default: 50
    },
    mode: {
      validator: function (value) {
        return ['show','jog'].indexOf(value) !== -1
      }
    },
    // jointPosRad: {
    //   type: Array
    // }
  },
  data(){
    return {
      hotEnabled: false,
      keyText: '启用快捷键',
      list: [49,50,51,52,53,54,55,65,83,68,90,88,67,70],
      keydown: false,
    }
  },
  computed: {
    jointPosRad() {
      var pos = [];
      for (let i = 0; i < 7; i++) {
        let v = this.$store.state.status.fromPLC.jointInfo[i].actualPos;
        pos.push(2 * Math.PI * v / 360);
      }
      return pos;
    },
    modelSpan() {
      if (this.mode=='jog') {
        return
      } else if (this.mode=='show') {
        return 24
      }
    }
  },
  methods: {
    moveInit() {
      moveInit()
    },
    stop() {
      stopTask().then((res) => {
        console.log(res)
      }).catch((err) => {
        console.log(err)
      })
    },
    recordPos() {
      this.$emit('record-pos')
    },

    enableHotkey: function() {
      if (this.hotEnabled) {
        this.disableJogKey()
        this.hotEnabled = false
        this.keyText = '启用快捷键'
      } else {
        this.enJogKey()
        this.hotEnabled = true
        this.keyText = '关闭快捷键'
      }
    },
    disableJogKey: function() {
      window.removeEventListener('keydown', this.keyDownListener)
      window.removeEventListener('keyup', this.keyUpListener)
    },
    enJogKey: function() {
      window.addEventListener('keydown', this.keyDownListener, false)
      window.addEventListener('keyup', this.keyUpListener, false)
    },
    keyDownListener: function(ev) {
      var shiftKey = ev.shiftKey

      if (this.keydown) {
        ev.preventDefault()
        return
      } else {
        this.keydown = true
      }
      // console.log('down' + ev.keyCode)
      // key: 1~7   J1~J7
      switch (ev.keyCode) {
        case 49:
          if (shiftKey) {
            jogAxis(-1, 0, this.speed)
          } else {
            jogAxis(1, 0, this.speed)
          }
          break;
        case 50:
          if (shiftKey) {
            jogAxis(-1, 1, this.speed)
          } else {
            jogAxis(1, 1, this.speed)
          }
          break;
        case 51:
          if (shiftKey) {
            jogAxis(-1, 2, this.speed)
          } else {
            jogAxis(1, 2, this.speed)
          }
          break;
        case 52:
          if (shiftKey) {
            jogAxis(-1, 3, this.speed)
          } else {
            jogAxis(1, 3, this.speed)
          }
          break;
        case 53:
          if (shiftKey) {
            jogAxis(-1, 4, this.speed)
          } else {
            jogAxis(1, 4, this.speed)
          }
          break;
        case 54:
          if (shiftKey) {
            jogAxis(-1, 5, this.speed)
          } else {
            jogAxis(1, 5, this.speed)
          }
          break;
        case 55:
          if (shiftKey) {
            jogAxis(-1, 6, this.speed)
          } else {
            jogAxis(1, 6, this.speed)
          }
          break;
        // A  jog X
        case 65:
          if (shiftKey) {
            jogLine(-1, 1, this.speed)
          } else {
            jogLine(1, 1, this.speed)
          }
          break;
        // S  jog Y
        case 83:
          if (shiftKey) {
            jogLine(-1, 2, this.speed)
          } else {
            jogLine(1, 2, this.speed)
          }
          break;
        // D  jog Z
        case 68:
          if (shiftKey) {
            jogLine(-1, 3, this.speed)
          } else {
            jogLine(1, 3, this.speed)
          }
          break;
        // Z  jog RX
        case 90:
          if (shiftKey) {
            jogLine(-1, 4, this.speed)
          } else {
            jogLine(1, 4, this.speed)
          }
          break;
        // X  jog RY
        case 88:
          if (shiftKey) {
            jogLine(-1, 5, this.speed)
          } else {
            jogLine(1, 5, this.speed)
          }
          break;
        // C  jog RZ
        case 67:
          if (shiftKey) {
            jogLine(-1, 6, this.speed)
          } else {
            jogLine(1, 6, this.speed)
          }
          break;
        // F  jog psi
        case 70:
          if (shiftKey) {
            jogPsi(-1, this.speed)
          } else {
            jogPsi(1, this.speed)
          }
        default:
          break;
      }
    },
    keyUpListener: function(ev) {
      // console.log('up' + ev.keyCode)
      this.keydown = false
      if (this.list.includes(ev.keyCode)) {
        this.stop()
      }
    }
  },
  components: {
    Jog,
  }
}
</script>

<style scoped>
.container {
  width: 100%;
  height: 400px;
}
.robot {
  height: 80%;
  width: 45%;
}
.robot-only {
  width: 90%;
  height: 80%;
}
.jog {
  width: 50%;
  margin-left: 20px;
}
.button {
  position: absolute;
  top: 420px;
  left: 40px;
}
</style>
