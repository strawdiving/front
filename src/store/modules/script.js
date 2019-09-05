/**
 *
 */
import { getScripts, getScript, createScript, updateScript, deleteScript, getGraphProgs, createProg, getGraphProg, updateProg, deleteProg} from '@/api'
const state = {
  // 文本程序
  scriptList: [],
  // 图形化程序
  graphList: [],

  activeProg: {
    type: '',
    name: '',
  },
  script: '',

  repeat: {
    repeated: false,
    times: 0,
  },
  isRepeating: false,
};

const mutations = {
  updateScriptList(state, list) {
    for (let i = 0; i < list.length; i++) {
      let info = {};
      info.name = list[i].name;
      info.mtime = list[i].mtime;
      info.size = list[i].size;

      state.scriptList[i] = info
    }
  },

  updateProgList(state, list) {
    for (let i = 0; i < list.length; i++) {
      let o = {}
      o.name = list[i].name
      o.mtime = list[i].mtime

      state.graphList[i] = o
    }
  },

  setActiveProg(state, data) {
    state.activeProg.type = data.type
    state.activeProg.name = data.name
  },

  updateScript(state, data) {
    state.script = data
  },

  deleteGraph(state, data) {
    var name = data.name
    var list = state.graphList.map(x => { return x.name })
    var index = list.indexOf(name)
    state.graphList.splice(index, 1)
  },
  deleteScript(state, data) {
    var name = data.name
    var list = state.scriptList.map(x => { return x.name })
    var index = list.indexOf(name)
    state.scriptList.splice(index, 1)
  },

  setRepeated(state, data) {
    state.repeat.repeated = data.repeated
    state.repeat.times = data.times
  },
  enRepeated(state,data) {
    state.repeat.repeated = data
  },
  minusRepeatTimes(state, data) {
    if (state.repeat.times < 1) return
    state.repeat.times--
  }

};

const actions = {
  getScriptList({ state, commit }) {
    return getScripts().then((res)=>{
      commit('updateScriptList', res.data.data)
    })
  },
  getProgList({ state, commit }) {
    return getGraphProgs().then((res)=>{
      commit('updateProgList', res.data.data)
    })
  },
  createGraph({ state, commit }, data) {
    // createProg(data).then((res) => {
    //   // 更新列表
    //   getProgList({ state, commit })
    // })
  },
  getGraph({ state, commit }, data) {
    return getGraphProg(data)
  },
  updateGraph({ state, commit }, data) {
    return updateProg(data)
  },
  delGraph({ state, commit }, data) {
    return deleteProg({name: data.name}).then((res)=>{
      commit('deleteGraph', data)
    })
  },

  getScript({ state, commit }, data) {
    return getScript(data).then((res)=>{
      // console.log(res.data)
      commit('updateScript', res.data.content)
    })
  },
  createScript({ state, commit }, data) {
    createScript(data).then((res) => {
      // 更新列表
      this.getScriptList({ state, commit})
    })
  },
  delScript({ state, commit }, data) {
    return deleteScript({ name: data.name }).then((res) => {
      commit('deleteScript', data)
    })
  }
};

export default {
  // 使用全局命名空间
  namespaced: false,
  state,
  actions,
  mutations
}
