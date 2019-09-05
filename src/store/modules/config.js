import { addCoord, updateCoord, deleteCoord, addModbusSignal, modifyModbusSignal, deleteModbusSignal } from "../../api/";
import { getCoords, getModbusList} from '@/api/config'
const state = {
  userCoords: [
    {
      name: 'userCoord1',
      type: 'user',
      params: [0, 0, 0, 0, 0, 0],
      desc: 'test 本user用来测试用'
    }
  ],
  tcpCoords: [
    {
      name: 'toolCoord1',
      type: 'tcp',
      params: {
        bias: [0, 0, 0, 0, 0, 0],
        load: 5,
        loadPos: [0,0,0],
      },
      desc: ''
    }
  ],
  modbusList: [],
  // {
  //   ip: '192.168.0.1',
  //   slave: 1,
  //   addr: 0,
  //   type: 1,
  //   name: 'Modbus1'
  // }

  functionList: [],
};

const mutations = {
  updateCoords(state, data) {
    state.userCoords = data.user
    state.tcpCoords = data.tcp
  },
  addCoord(state, coord) {
    let o = _.cloneDeep(coord)
    if (coord.type === 'user') {
      state.userCoords.push(o)
    }
    else if (coord.type === 'tcp') {
      state.tcpCoords.push(o)
    }
  },
  modifyCoord(state, data) {
    var index = data.index
    var type = data.type
    if (type === 'user') {
      var o = state.userCoords[index]
      o.name = data.name
      o.params = data.params.slice(0)
      o.desc = data.desc
    } else if (type === 'tcp') {
      var o = state.tcpCoords[index]
      o.name = data.name
      o.params.bias = data.params.bias.slice(0)
      o.params.load = data.params.load
      o.params.loadPos = data.params.loadPos.slice(0)
      o.desc = data.desc
    }
  },
  deleteCoord(state, params) {
    if (params.type === 'user') {
      console.log(state.userCoords, params.index)
      state.userCoords.splice(params.index, 1)
    } else if (params.type === 'tcp') {
      console.log(state.tcpCoords, params.index)
      state.tcpCoords.splice(params.index, 1)
    }
  },

  updateModbus(state, data) {
    state.modbusList = data
  },

  addModbus(state, data) {
    state.modbusList.push(data)
  },
  deleteModbus(state, data) {
    var index = data.index
    if (index < 0 || index > state.modbusList.length - 1)
      return
    state.modbusList.splice(index, 1)
  },
  modifyModbus(state, data) {
    var index = data.index
    if (index < 0 || index > state.modbusList.length - 1)
      return
    var o = state.modbusList[index]
    o.ip = data.ip
    o.type = data.type
    o.slave = data.slave
    o.addr = data.addr
    o.name = data.name
  },
  addFunction(state, payload) {
    state.functionList.push(payload)
  }
};

const actions = {
  // 更新 userCoords 和 tcpCoords
  updateCoords({ state, commit }) {
    getCoords().then((res) => {
      console.log(res)
      commit('updateCoords', res.data)
    })

  },
  addCoord({ state, commit }, data) {
    return addCoord(data)
      .then((res) => {
        commit('addCoord', data)
      })
  },
  modifyCoord({ state, commit }, data) {
    return updateCoord(data)
      .then((res) => {
        commit('modifyCoord', data)
      })
  },
  deleteCoord({ state, commit }, data) {
    return deleteCoord(data)
      .then((res) => {
        commit('deleteCoord', data)
      })
  },

  getModbus({ state, commit }) {
    return getModbusList().then((res) => {
      commit('updateModbus', res.data)
    })
  },
  addModbus({ state, commit }, data) {
    return addModbusSignal(data).then((res) => {
      commit('addModbus', data)
    })
  },
  modifyModbus({ state, commit }, data) {
    return modifyModbusSignal(data).then((res) => {
      commit('modifyModbus', data)
    })
  },
  deleteModbus({ state, commit }, data) {
    return deleteModbusSignal(data).then((res) => {
      commit('deleteModbus', data)
    })
  },

};

export default {
  // 使用全局命名空间
  namespaced: false,
  state,
  actions,
  mutations
}
