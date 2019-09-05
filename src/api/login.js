import request from './request'
import sha from 'sha.js'

export function loginByUsername(username, password) {
  var pswdHash = sha('sha256').update(username + password + 'siasun').digest('hex')
  const data = {
    username: username,
    password: pswdHash
  }

  return request({
    url: '/login/login',
    method: 'post',
    headers: {
      // origin: 'http://127.0.0.1:3000',
      // 'Access-Control-Request-Method': 'GET',
      // 'Access-Control-Request-Headers': 'X-Token'
    },
    withCredentials: false,
    // credentials: 'same-origin',
    data
  })
}

export function logout() {
  return request({
    url: '/login/logout',
    method: 'post'
  })
}

export function getUserInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    headers: {
      // origin: 'http://127.0.0.1:3000',
      // 'Access-Control-Request-Method': 'GET',
      // 'Access-Control-Request-Headers': 'X-Token'
    },
    withCredentials: false,
    // credentials: 'same-origin',
    params: {token}
  })
}
