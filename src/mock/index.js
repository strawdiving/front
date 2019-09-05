import Mock from 'mockjs'
import loginAPI from './login'
import configAPI from './config'

// 登录相关
Mock.mock(/\/login\/login/,'post',loginAPI.loginByUsername)
Mock.mock(/\/login\/logout/,'post',loginAPI.logout)
Mock.mock(/\/user\/info\.*/,'get',loginAPI.getUserInfo)

Mock.mock(/\/config\/init/, 'get',configAPI.getConfigs)
Mock.mock(/\/config\/coordinates/, 'get',configAPI.getCoords)
Mock.mock(/\/functions/, 'get',configAPI.getFunctionList)
Mock.mock(/\/modbus/, 'get',configAPI.getModbusList)

export default Mock
