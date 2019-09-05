/**
 * 坐标系设置、牵引示教, 与中间层setValue结构体对应等; 与中间层setValueData保持同步
 */
import { setBaseCoord, setSimulationMode, setTeachParam, setTcp, setUserCoord, sendProgramStopped, setThreeSwitch } from '@/api/param'

const state = {
  // 用户坐标系
  coordinate: [0, 0, 0, 0, 0, 0],
  // 工具坐标系
  tcpCoord: {
    tcpBias: [0, 0, 0, 0, 0, 0],
    pcLoad: 0,
    pcLoadPos: [0, 0, 0]
  },
  threeSwitchActive: false,
  
  handTechSmoothAll: 0,
  handTechSmoothSep: [0, 0, 0, 0, 0, 0, 0],
  handTechRecordActive: false,

  programStopped: false,

  collisionDetectActive: false,
  collisionSensitive: 0,
  collisionDyThresholdActive: false,
  collisionDyThreshold: [0, 0, 0, 0, 0, 0, 0],

  tcpCalibration: {
    type: 0,
    step: 0,
    rXYZ: [0, 0, 0],
  },
  simulationMode: false,
}

const mutations = {
  updateSetValue(state, data) {
    state.coordinate = _.cloneDeep(data.coordinate)
    state.tcpCoord = _.cloneDeep(data.tcpCoord)
    state.threeSwitchActive = data.threeSwitchActive

    state.handTechSmoothAll = data.handTechSmoothAll
    state.handTechSmoothSep = _.cloneDeep(data.handTechSmoothSep)
    state.handTechRecordActive = _.cloneDeep(data.handTechRecordActive)
    
    state.programStopped = data.programStopped
    state.collisionDetectActive = data.collisionDetectActive
    state.collisionSensitive = data.collisionSensitive
    state.collisionDyThresholdActive = data.collisionDyThresholdActive
    state.collisionDyThreshold = _.cloneDeep(data.collisionDyThreshold)

    state.tcpCalibration = _.cloneDeep(data.tcpCalibration)

    state.simulationMode = data.simulationMode
  },

  updateCoord(state, data) {
    for (let i = 0; i < 6; i++) {
      state.coordinate[i] = data[i]
    }
  },
  updateTcp(state, data) {
    state.tcpCoord.tcpBias = data.bias
    state.tcpCoord.pcLoad = data.load
    state.tcpCoord.pcLoadPos = data.loadPos
  },

  // updateTcpCali(state, date) {
  //   state.tcpCalibration.type = data.type
  //   state.tcpCalibration.step = step
  //   for (let i = 0; i < 3; i++) {
  //     state.tcpCalibration.rXYZ[i] = rxyz[i]
  //   }
  // },

  updateTeachSmoothAll(state, val) {
    state.handTechSmoothAll = val
  },
  updateTeachSmoothSep(state, val) {
    state.handTechSmoothSep = val
  },
  updateSim(state, active) {  
    state.simulationMode = active
  },
  updateThreeSwitch(state, enable) {
    state.threeSwitchActive = enable
  },
  updateProgramStop(state, stopped) {
    state.programStopped = stopped
  }
}

const actions = {
  // 设置基坐标系
  setCoordBase({commit, state}) {
    let s = _.cloneDeep(state)
    s.coordinate = [0, 0, 0, 0, 0, 0]

    return setBaseCoord(s).then((res)=>{
      commit('updateCoord', [0, 0, 0, 0, 0, 0])
    })
  },
  // 设置tcp坐标
  setCoordTcp({commit, state}, tcp) {
    let s = _.cloneDeep(state)
    s.tcpCoord.tcpBias = tcp.tcpBias

    return setTcpCoord(s).then((res) => {
      commit('updateTcp', tcp)
    })
  },
  // 设置用户坐标
  setCoordUser({ commit, state }, val) {
    let s = _.cloneDeep(state)
    s.coordinate = val

    return setUserCoord(s).then((res)=> {
      commit('updateCoord', val)
    })
  },
  
  // 切换仿真模式
  setSimulation({commit, state}, active) {
    let s = _.cloneDeep(state)
    s.simulationMode = active

    return setSimulationMode(s).then((res)=>{
      commit('updateSim', active)
    })
  },

  // 设置整体牵引柔顺度
  setTeachSmoothAll({commit, state}, val) {
    let s = _.cloneDeep(state)
    s.handTechSmoothAll = val

    return setTeachParam(s).then((res)=>{
      commit('updateTeachSmoothAll', val)
    })
  },

  // 设置各关节牵引柔顺度
  setTechSmoothSep({commit, state}, axisVal) {
    let s = _.cloneDeep(state)
    s.handTechSmoothSep = _.cloneDeep(axisVal)

    return setTeachParam(s).then((res) => {
      commit('updateTeachSmoothAll', axisVal)
    })
  },

  // // tcp校准
  // caliTcp({commit, state}, data) {
  //   let s = _.cloneDeep(state)
  //   s.tcpCalibration.type = data.type
  //   s.tcpCalibration.step = data.step
  //   s.tcpCalibration.rXYZ = data.rXYZ

  //   return setTcpCali(s).then((res) => {
  //     commit('updateTcpCali', data)
  //   })
  // }

  sendIfProgramStopped({ commit, state }, stopped) {
    let s = _.cloneDeep(state)
    s.programStopped = stopped

    return sendProgramStopped(s).then((res)=>{
      commit('updateProgramStop', stopped)
    })
  },
  setThreeSwitchEnable({ commit, state }, enable) {
    let s = _.cloneDeep(state)
    if (enable != null) {
      s.threeSwitchActive = enable
    }
    return setThreeSwitch(s).then((res)=>{
      if (enable != null) {
        commit('updateThreeSwitch', enable)
      }
    })
  }

}

export default {
  namespaced: false,
  state,
  actions,
  mutations
}
