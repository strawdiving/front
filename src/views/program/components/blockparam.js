import {posl, posj} from './paramLimit.js'
var blockParam = blockParam || {}

var pose = {
  x: {
    type: Number,
    min: posl.minX,
    max: posl.maxX,
    default: 0,
    unit: 'mm',
    step: 0.01,
    label: 'pose/X',
  },

  y: {
    type: Number,
    min: posl.minY,
    max: posl.maxY,
    default: 0,
    unit: 'mm',
    step: 0.01,
    label: 'pose/Y',
  },

  z: {
    type: Number,
    min: posl.minZ,
    max: posl.maxZ,
    default: 0,
    unit: 'mm',
    step: 0.01,
    label: 'pose/Z',
  },

  rx: {
    type: Number,
    min: posl.minRX,
    max: posl.maxRX,
    default: 0,
    unit: 'mm',
    step: 0.01,
    label: 'pose/RX',
  },

  ry: {
    type: Number,
    min: posl.minRY,
    max: posl.maxRY,
    default: 0,
    unit: 'mm',
    step: 0.01,
    label: 'pose/RY',
  },

  rz: {
    type: Number,
    min: posl.minRZ,
    max: posl.maxRZ,
    default: 0,
    unit: 'mm',
    step: 0.01,
    label: 'poseRZ',
  },
}

var posej = {
  axis1: {
    type: Number,
    min: -posj.j1,
    max: posj.j1,
    step: 0.02,
    default: 0,
    unit: 'deg',
    label: 'Axis_1',
    group: 'axis',
  },
  axis2: {
    type: Number,
    min: -posj.j2,
    max: posj.j2,
    step: 0.02,
    default: 0,
    unit: 'deg',
    label: 'Axis_2',
    group: 'axis',
  },
  axis3: {
    type: Number,
    min: -posj.j3,
    max: posj.j3,
    step: 0.02,
    default: 0,
    unit: 'deg',
    label: 'Axis_3',
    group: 'axis',
  },
  axis4: {
    type: Number,
    min: -posj.j4,
    max: posj.j4,
    step: 0.02,
    default: 0,
    unit: 'deg',
    label: 'Axis_4',
    group: 'axis',
  },
  axis5: {
    type: Number,
    min: -posj.j5,
    max: posj.j5,
    step: 0.02,
    default: 0,
    unit: 'deg',
    label: 'Axis_5',
    group: 'axis',
  },
  axis6: {
    type: Number,
    min: -posj.j6,
    max: posj.j6,
    step: 0.02,
    default: 0,
    unit: 'deg',
    label: 'Axis_6',
    group: 'axis',
  },
  axis7: {
    type: Number,
    min: -posj.j7,
    max: posj.j7,
    step: 0.02,
    default: 0,
    unit: 'deg',
    label: 'Axis_7',
    group: 'axis',
  }
}

blockParam = {
  MoveL: {
    label: "",
    describe: "按直线移动末端",
    appendNext: true,
    params: {
      pose: {
        type: 'pose',
        val: pose,
        label: 'Pose',
        describe: '目标点'
      },

      speed: {
        type: Number,
        min: 0,
        max: 500,
        default: 100,
        unit: 'mm/s',
        step: 1,
        label: 'speed',
        describe: '末端速度',
        group: 'common',
      },
      acc: {
        type: Number,
        min: 0,
        max: 5000,
        step: 1,
        default: 500,
        unit: 'mm/s^2',
        label: 'acc',
        describe: '末端加速度',
        group: 'common',
      },
      rad: {
        type: Number,
        min: 0,
        max: 99999999,
        step: 0.1,
        default: -1,
        unit: 'mm',
        label: 'rad',
        describe: '融合半径',
        group: 'advance'
      },
      psi: {
        type: Number,
        min: -3.14,
        max: 3.14,
        step: 0.01,
        default: 888,
        unit: 'rad',
        label: 'Psi',
        describe: '臂形角',
        group: 'advance'
      },
    }
  },

  MoveJ: {
    label: "",
    describe: "按关节移动末端",
    appendNext: true,
    params: {
      pose: {
        type: 'pose',
        val: posej,
        label: 'Pose',
        describe: '目标点'
      },

      speed: {
        type: 'percentage',
        min: 0,
        max: 100,
        step: 1,
        default: 30,
        unit: '%',
        label: 'v',
        describe: '关节角速度',
        group: 'common',
      },

      acc: {
        type: Number,
        min: -200,
        max: 5000,
        step: 1,
        default: 2000,
        unit: '°/s2',
        label: 'acc',
        describe: '关节加速度',
        group: 'common',
      },
      // rad: {
      //   type: Number,
      //   min: -3.14,
      //   max: 3.14,
      //   step: 0.02,
      //   default: 0,
      //   unit: 'mm',
      //   label: 'rad',
      //   describe: '融合半径',
      //   group: 'parameters',
      // }

    }
  },

  tcp_Move: {
    label: "",
    describe: "控制机械臂沿工具坐标系移动一个增量",
    appendNext: true,
    params: {
      x: {
        type: Number,
        min: posl.minX,
        max: posl.maxX,
        step: 0.01,
        default: 0,
        unit: 'mm',
        label: 'deltaX',
        describe: 'X',
        group: 'delta',
      },
      y: {
        type: Number,
        min: posl.minY,
        max: posl.maxY,
        step: 0.01,
        default: 0,
        unit: 'mm',
        label: 'deltaY',
        describe: 'Y',
        group: 'delta',
      },
      z: {
        type: Number,
        min: posl.minZ,
        max: posl.maxZ,
        step: 0.01,
        default: 0,
        unit: 'mm',
        label: 'deltaZ',
        describe: 'Z',
        group: 'delta',
      },
      rx: {
        type: Number,
        min: posl.minRX,
        max: posl.maxRX,
        step: 0.01,
        default: 0,
        unit: 'rad',
        label: 'deltaRX',
        describe: 'RX',
        group: 'delta',
      },
      ry: {
        type: Number,
        min: posl.minRY,
        max: posl.maxRY,
        step: 0.01,
        default: 0,
        unit: 'rad',
        label: 'deltaRY',
        describe: 'RY',
        group: 'delta',
      },
      rz: {
        type: Number,
        min: posl.minRZ,
        max: posl.maxRZ,
        step: 0.01,
        default: 0,
        unit: 'rad',
        label: 'deltaRZ',
        describe: 'RZ',
        group: 'delta',
      },
      speed: {
        type: Number,
        min: 0,
        max: 500,
        step: 1,
        default: 100,
        unit: 'm/s',
        label: 'speed',
        describe: '速度',
        group: 'parameters',
      }
    }, 
  },

  MoveC: {
    label: "",
    describe: "按关节移动末端",
    appendNext: false,
    params: {
      pose: {
        type: 'pose',
        val: pose,
        label: 'P1',
        describe: '中间点'
      },
      posec: {
        type: 'pose',
        val: pose,
        label: 'P2',
        describe: '目标点'
      },
      speed: {
        type: Number,
        min: 0,
        max: 500,
        default: 100,
        unit: 'mm/s',
        step: 1,
        label: 'speed',
        describe: '末端速度',
        group: 'common',
      },
      acc: {
        type: Number,
        min: 0,
        max: 5000,
        step: 1,
        default: 500,
        unit: 'mm/s^2',
        label: 'acc',
        describe: '末端加速度',
        group: 'common',
      },
      rad: {
        type: Number,
        min: 0,
        max: 99999999,
        step: 0.1,
        default: -1,
        unit: 'mm',
        label: 'Rad',
        describe: '融合半径',
        group: 'advance'
      },
      psi: {
        type: Number,
        min: -3.14,
        max: 3.14,
        step: 0.01,
        default: 888,
        unit: 'rad',
        label: 'Psi',
        describe: '臂形角',
        group: 'advance'
      },
    }
  },

  Move_phi: {
    label: "",
    describe: "按某个方向转动一个臂形角的增量",
    params: {
      angle_inc: {
        type: Number,
        min: -180,
        max: 180,
        step: 0.1,
        default: 0,
        unit: "deg",
        label: 'Angle',
        describe: '臂形角的增量'
      },
      v: {
        type: 'percentage',
        min: 0,
        max: 100,
        step: 1,
        default: 50,
        unit: '%',
        label: 'v',
        describe: '移动速度',
      }
    }
  },

}

export { blockParam }
