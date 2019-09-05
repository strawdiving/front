import axios from 'axios'

let base = 'http://192.168.0.3:3000/api'

export const requestLogin = params => {
  return axios.post('http://192.168.0.3:3000/login', params)
}

export const getStatus = params => {
  return axios.get(`${base}/status?api-key=siasun`, {
    params: params
  })
}

export const jogTask = params => {
  return axios.post(`${base}/task?api-key=siasun`, params)
}

// direction: 1,-1;  index: 0-6
export const jogAxis = (direction, index, speed) => {
  let para = {
    deviceId: 1,
    cmd: "jog",
    data: {
      type: 2,
      num: index,
      direction: direction,
      speed: speed || 80
    }
  }
  return jogTask(para)
}
// direction: 1,-1;  index: 1-6
export const jogLine = (direction, index, speed) => {
  let para = {
    deviceId: 1,
    cmd: "jog",
    data: {
      type: 1,
      num: index + 1,
      direction: direction,
      speed: speed || 80
    }
  }
  return jogTask(para)
}

export const jogPsi = (direction, speed) => {
  let para = {
    deviceId: 1,
    cmd: "jog",
    data: {
      type: 3,
      num: 0,
      direction: direction,
      speed: speed || 80
    }
  }
  return jogTask(para)
}
export const moveTask = params => {
  return axios.post(`${base}/task?api-key=siasun`, params)
}

export const moveInit = () => {
  let para = {
    deviceId: 1,
    cmd: "move",
    data: {
      type: 0,
      pose: [0, 0, 0, 0, 0, 0, 0],
      pose2: [],
      speed: 70,
      acc: 0,
      rad: -1,
      psi: 999
    }
  }
  return axios.post(`${base}/task?api-key=siasun`, para)
}

export const moveTo = (type, pose, jogSpeed) => {
  let para = {
    deviceId: 1,
    cmd: "move",
    data: {
      type: type,
      pose: [],
      pose2: [],
      speed: 70,
      acc: 0,
      rad: -1,
      psi: 999
    }
  }

  if (type === 0) {
    //movej
    for (let i = 0; i < 7; i++) para.data.pose[i] = pose[i]
    para.data.speed = jogSpeed * 0.3
  } else if (type === 1) {
    //movel
    for (let i = 0; i < 6; i++) para.data.pose[i] = pose[i]
    para.data.speed = 500 * jogSpeed / 100
  } else if (type === 3) {
    // cartesian movej
    for (let i = 0; i < 6; i++) para.data.pose[i] = pose[i]
    para.data.speed = jogSpeed * 0.3
  }

  return axios.post(`${base}/task?api-key=siasun`, para)
}

export const switch2Teach = () => {
  return axios.post(`${base}/task?api-key=siasun`, {
    deviceId: 1,
    cmd: "teach"
  })
}

export const switch2Manual = () => {
  return axios.post(`${base}/task?api-key=siasun`, {
    deviceId: 1,
    cmd: "manual"
  })
}

export const ioTask = params => {
  return axios.post(`${base}/task?api-key=siasun`, params)
}

export const scriptTask = params => {
  return axios.post(`${base}/task?api-key=siasun`, params)
}

export const powerOn = () => {
  return axios.post(`${base}/task?api-key=siasun`, {
    deviceId: 1,
    cmd: "powerOn"
  })
}

export const powerOff = () => {
  return axios.post(`${base}/task?api-key=siasun`, {
    deviceId: 1,
    cmd: "powerOff"
  })
}

export const enable = () => {
  return axios.post(`${base}/task?api-key=siasun`, {
    deviceId: 1,
    cmd: "enable"
  })
}

export const reset = () => {
  return axios.post(`${base}/task?api-key=siasun`, {
    deviceId: 1,
    cmd: "reset"
  })
}

export const disable = () => {
  return axios.post(`${base}/task?api-key=siasun`, {
    deviceId: 1,
    cmd: "disable"
  })
}

export const start = () => {
  return axios.post(`${base}/task?api-key=siasun`, {
    deviceId: 1,
    cmd: "start"
  })
}

export const stopTask = () => {
  return axios.post(`${base}/task?api-key=siasun`, {
    deviceId: 1,
    cmd: "stop"
  })
}

export const pauseTask = () => {
  return axios.post(`${base}/task?api-key=siasun`, {
    deviceId: 1,
    cmd: "pause"
  })
}

export const resumeTask = () => {
  return axios.post(`${base}/task?api-key=siasun`, {
    deviceId: 1,
    cmd: "resume"
  })
}

export const getParams = params => {
  return axios.get(`${base}/param?api-key=siasun`, {
    params: params
  })
}

export const postParams = params => {
  return axios.post(`${base}/param?api-key=siasun`, params)
}


// scripts
export const getScripts = params => {
  return axios.get(`${base}/prog/scripts?api-key=siasun`, {
    params: params
  })
}

export const getScript = params => {
  return axios.get(`${base}/prog/scripts/${params.name}?api-key=siasun`, {
    params: params
  })
}
export const createScript = params => {
  return axios.post(`${base}/prog/scripts?api-key=siasun`, params)
}
export const updateScript = params => {
  return axios.put(`${base}/prog/scripts/${params.name}?api-key=siasun`, params)
}
export const deleteScript = params => {
  return axios.delete(`${base}/prog/scripts/${params.name}?api-key=siasun`, {
    params: params
  })
}

export const getGraphProgs = params => {
  return axios.get(`${base}/prog/graphs?api-key=siasun`, {
    params: params
  })
}
export const getGraphProg = params => {
  return axios.get(`${base}/prog/graphs/${params.name}?api-key=siasun`, {
    params: params
  })
}
export const createProg = params => {
  return axios.post(`${base}/prog/graphs?api-key=siasun`, params)
}
export const updateProg = params => {
  return axios.put(`${base}/prog/graphs/${params.name}?api-key=siasun`, params)
}
export const deleteProg = params => {
  return axios.delete(`${base}/prog/graphs/${params.name}?api-key=siasun`, {
    params: params
  })
}

export const getLogs = params => {
  return axios.get(`${base}/logs?api-key=siasun`, {
    params: params
  })
}

export const readLog = params => {
  return axios.get(`${base}/logs/${params.name}?api-key=siasun`, {
    params: params
  })
}

// export const setTcp = params => {return axios.post(`${base}/config/tcp?api-key=siasun`, params)}

// export const getConfigs = params => { return axios.get(`${base}/config/init?api-key=siasun`, { params: params })}

export const editConfig = params => {
  return axios.post(`${base}/config/init?api-key=siasun`, params)
}

// export const getCoords = params => { return axios.get(`${base}/config/coordinates?api-key=siasun`, { params: params }) }
export const addCoord = params => {
  return axios.post(`${base}/config/coordinates?api-key=siasun`, params)
}
export const updateCoord = params => {
  return axios.put(`${base}/config/coordinates?api-key=siasun`, params)
}
export const deleteCoord = params => {
  return axios.delete(`${base}/config/coordinates?api-key=siasun`, {
    params: params
  })
}

export const sendProgram = params => {
  return axios.post(`${base}/program?api-key=siasun`, params)
}

// update
// delete

export const getFunctionList = params => {
  return axios.get(`${base}/functions?api-key=siasun`, {
    params: params
  })
}
export const addFunction = params => {
  return axios.post(`${base}/functions?api-key=siasun`, params)
}
export const deleteFunction = params => {
  return axios.delete(`${base}/functions?api-key=siasun`, {
    params: params
  })
}


export const getModbusList = params => {
  return axios.get(`${base}/config/modbus?api-key=siasun`, {
    params: params
  })
}
export const addModbusSignal = params => {
  return axios.post(`${base}/config/modbus?api-key=siasun`, params)
}
export const modifyModbusSignal = params => {
  return axios.post(`${base}/config/modbus?api-key=siasun`, params)
}
export const deleteModbusSignal = params => {
  return axios.delete(`${base}/config/modbus?api-key=siasun`, {
    params: params
  })
}

export const addUser = params => {
  return axios.post(`${base}/users/user?api-key=siasun`, params)
}
export const deleteUser = params => {
  return axios.delete(`${base}/users/user?api-key=siasun`, {
    params: params
  })
}
