import { addUser, deleteUser} from "../../api/";
import { getUserList} from '@/api/config'
const state = {
  userList: [
    {
      userName: '',
      type: 0
    }
  ]
};

const mutations = {
  addUser(state, user) {
    let o = _.cloneDeep(user)
    state.userList.push(o)
  },
  deleteUser(state, data) {
    var index = data.index
    if (index < 0 || index > state.userList.length - 1)
      return
    state.userList.splice(index, 1)
  },
};

const actions = {
  getUsers({ state, commit }) {
    return getUserList().then((res) => {
      commit('updateModbus', res.data)
    })
  },
  addUser({ state, commit }, data) {
    return addUser(data).then((res) => {
      commit('addUser', data)
    })
  },
  deleteUser({ state, commit }, data) {
    return deleteUser(data).then((res) => {
      commit('deleteUser', data)
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
