// import {loginByUsername} from "../api/login";
import {param2Obj} from "../utils";
import store from "../store";

const userMap = {
  superAdmin: {
    token: 'superAdmin',
    roles: ['superAdmin'],
    introduction: '我是高级管理员',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Super Admin'
  },
  admin: {
    token: 'admin',
    roles: ['admin'],
    introduction: '我是管理员',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Admin'
  },
  user: {
    token: 'user',
    roles: ['user'],
    introduction: '我是游客',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Normal user'
  }
}

export default {
  loginByUsername: config => {
    const {username} = JSON.parse(config.body)
    return userMap[username]
  },

  logout: () => 'success',

  getUserInfo: config => {
    const {token} = param2Obj(config.url)
    if(userMap[token]) {
      return userMap[token]
    }
    else {
      return false
    }
  }
}
