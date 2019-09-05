import axios from 'axios'
let base = 'http://192.168.0.3:3000/api'

export const setBaseCoord = params => {
  let para = {
    deviceId: 1,
    type: 'baseCoord',
    data: params
  }
  return axios.post(`${base}/param?api-key=siasun`, para)
}

export const setTcp = params => {
  let para = {
    deviceId: 1,
    type: 'tcp',
    data: params
  }
  return axios.post(`${base}/param?api-key=siasun`, para)
}

export const setUserCoord = params => {
  let para = {
    deviceId: 1,
    type: 'userCoord',
    data: params
  }
  return axios.post(`${base}/param?api-key=siasun`, para)
}

export const setTeachParam = params => {
  let para = {
    deviceId: 1,
    type: 'teach',
    data: params
  }
  return axios.post(`${base}/param?api-key=siasun`, para)
}

// // 设置碰撞检测参数
// export const setCollisionParam = params => {
//     let para = {
//         deviceId: 1,
//         type: 'collision',
//         data: params
//     }
//     return axios.post(`${base}/param?api-key=siasun`, para)
// }
// // tcp校准
// export const setTcpCali = params => {
//     let para = {
//         deviceId: 1,
//         type: 'tcpCali',
//         data: params
//     }
//     return axios.post(`${base}/param?api-key=siasun`, para)
// }
//
export const setSimulationMode = params => {
  let para = {
    deviceId: 1,
    type: 'sim',
    data: params
  }
  return axios.post(`${base}/param?api-key=siasun`, para)
}

export const sendProgramStopped = params => {
  let para = {
    deviceId: 1,
    type: 'progStop',
    data: params
  }
  return axios.post(`${base}/param?api-key=siasun`, para)
}

export const setThreeSwitch = params => {
  let para = {
    deviceId: 1,
    type: 'enSwitch',
    data: params
  }
  return axios.post(`${base}/param?api-key=siasun`, para)
}
