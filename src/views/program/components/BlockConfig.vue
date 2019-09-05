<template>
  <div id="config">
    <component :is="configType"
      :info="info"
      :index="index"
      @config-cancel="cancel"
      @config-change="$emit('config-change',$event)"
      @config-confirm="confirm"
      @show-jog="$emit('show-jog', $event)">
    </component>
  </div>
</template>

<script>
import MoveConfig from './configs/MoveConfig'
import WaitConfig from './configs/WaitConfig'
import CoordConfig from './configs/CoordConfig'
import IoConfig from './configs/IoConfig'
import SetConfig from './configs/SetConfig'
import CallScript from './configs/CallScript'
import CallFun from './configs/CallFun'
import ModbusConfig from './configs/ModbusConfig'
import WhileConfig from './configs/WhileConfig'
import IfConfig from './configs/IfConfig'
import MoveCamConfig from './configs/MoveCamConfig'
import SubprogConfig from './configs/SubprogConfig'
import PrintConfig from './configs/PrintConfig'
import NullConfig from './configs/NullConfig'
export default {
  data() {
    return {
      configType: null,
    }
  },
  props: ["info", "index"],
  computed: {

  },
  methods: {
    currentComp: function() {
      var t
      switch (this.info.type) {
        case 'Move':
          t = MoveConfig
          break;
        case 'Wait':
          t = WaitConfig
          break;
        case 'IO':
          t = IoConfig
          break;
        case 'Coord':
          t = CoordConfig
          break;
        case 'Set':
          t = SetConfig
          break;
        case 'Fun':
          t = CallFun
          break;
        case 'Script':
          t = CallScript
          break;
        case 'Modbus':
          t = ModbusConfig
          break;
        case 'logic':
          if (this.info.tag == 'WHILE') {
            t = WhileConfig
          } else if (this.info.tag == 'IF' || this.info.tag == 'ELIF') {
            t = IfConfig
          } else {
            t = NullConfig
          }
          break;
        case 'moveCam':
          t = MoveCamConfig
          break;
        case 'Subprog':
          t = SubprogConfig
          break;
        case 'Print':
          t = PrintConfig
          break;
        default:
          t = NullConfig
          break;
      }
      return t
    },
    cancel: function() {
      this.$emit('config-cancel')
    },
    confirm: function(val) {
      this.$emit('config-confirm', val)
    },
  },
  created() {
    this.configType = this.currentComp()
  },
  components: {
    MoveConfig,
    WaitConfig,
    IoConfig,
    CoordConfig,
    SetConfig,
    CallScript,
    CallFun,
    WhileConfig,
    IfConfig,
    ModbusConfig,
    MoveCamConfig,
    SubprogConfig,
    PrintConfig,
    NullConfig
  }
}
</script>

<style scoped>
#config {
  position: absolute;
  left: 15px;
  right: 5px;
  top: 5px;
  bottom: 5px;
}
</style>
