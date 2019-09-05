import Mock from 'mockjs'

const configs = Mock.mock({
  runAuto: {
    on: '@boolean',
    defaultProgName: '@string',
    'digitalIn|1': [0,1],
    status: '@boolean'
  },
  toolCoord: {
    on: '@boolean',
    param: [0, 0, 100, 0, 0, 0]
  },
  //end tool weight and weight point position
  toolLoad: {
    weight: '@integer(0,10)',
    pos: [44, 45, 56]
  },
  userCoord: {
    on: '@boolean',
    param: [0, 0, 100, 0, 0, 0]
  },
  maxSpeed: 1000,
  initPoint: [0, 0, 0, 0, 0, 0, 0],
  'language|1': ['cn','en'],
  model: '@integer(0,6)',
  autoLogin: '@boolean',
})
const functionList = Mock.mock({
 functions: [{
   name: '@string',
   description: '@sentence',
   argNum: 2,
   argList: [
     {id:0,type: 'int',name: '@string'},
     {id:1,type: 'int',name: '@string'}],
   content: '@paragraph',
   return: '@integer(0,1)'
 },{
   name: '@string',
   description: '@sentence',
   argNum: 2,
   argList: [
     {id:0,type: 'int',name: 'num1'},
     {id:1,type: 'int',name: 'num2'}],
   content: '@sentence',
   return: '@integer(0,1)'
 }]
})

const modbusList = []

for(let i=0; i<3;i++) {
  modbusList.push(Mock.mock(
   {
      index: '@increment',
      ip: '@ip',
      type: '@integer(1,4)',
      slave: '@integer(0,1)',
      addr: '@integer(0,255)',
      'name': /Modbus\d/
    }))
}

const toolCoords = []
const userCoords = []

const coordinates = {
  user: userCoords,
  tcp: toolCoords
}

for(let i=0; i<3;i++) {
  toolCoords.push(Mock.mock(
    {
      name: '@word',
      type: 'tcp',
      params: {
        bias: [0,0,100,0,0,0]
      }
    }))
  userCoords.push(Mock.mock(
    {
      name: '@word',
      type: 'user',
      params: [0,0,100,0,0,0],
      desc: '@sentence'
    }))
}

// const config = {
//   initConfig: {
//     data: getConfig,
//     editConfigs: editConfigs
//   },
//   coordinates: {
//     coords: getCoords,
//     addCoord: addCoord,
//     updateCoord: updateCoord,
//     deleteCoord: deleteCoord,
//   },
//   functions: {
//     functionList: getFunctionList,
//     addFunction: addFunction,
//     deleteFunction: deleteFunction
//   },
//   modbus: {
//     modbusList: getModbusList,
//     addModbusSignal: addModbusSignal,
//     deleteModbusSignal: deleteModbusSignal
//   },
//   loadConfigFile: loadConfigFile,
//   writeConfig: writeConfigFile
// }

export default {
  getConfigs: config => {
    return configs
  },
  editConfig: config => {

  },
  getCoords: config => {
    return coordinates
  },
  getFunctionList: config => {
    return functionList
  },
  getModbusList: config => {
    return modbusList
  }
}
