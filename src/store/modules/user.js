import { loginByUsername, logout, getUserInfo} from '@/api/login'
import {getToken, setToken, removeToken} from "../../utils/auth";

const user = {
  state: {
    user: '',
    name: '',
    token: getToken(),
    roles: [],
    // avatar: '',
    introduction: ''
  },

  mutations: {
    // SET_USER: (state, user) => {
    //   state.user = user
    // },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_INTRODUCTION: (state, introduction) => {
      state.introduction = introduction
    },
    // SET_AVATAR: (state, avatar) => {
    //   state.avatar = avatar
    // },
    SET_ROLES: (state,roles) => {
      state.roles = roles
    }
  },

  actions: {
    // 用户名登录
    LoginByUsername({ commit }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        loginByUsername(username, userInfo.password).then(response => {
          const data = response.data
          // console.log(data)
          setToken(data.token)
          commit('SET_TOKEN',data.token)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },


    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN','')
          commit('SET_ROLES',[])
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    getUserInfo({commit,state}) {
      return new Promise((resolve,reject) => {
        getUserInfo(state.token).then(response => { // 由于mockjs 不支持自定义状态码只能这样hack
          if(!response.data) {
            reject('error')
          }
          const data = response.data

          if(data.roles && data.roles.length >0) {// 验证返回的roles是否是一个非空数组
            commit('SET_ROLES',data.roles)
          }
          else {
            reject('getUserInfo: roles must be a non-null array !')
          }
          // commit('SET_USER',data.user)
          commit('SET_NAME',data.name)
          // commit('SET_AVATAR',data.avatar)
          commit('SET_INTRODUCTION', data.introduction)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    }
  }
}

export default user

