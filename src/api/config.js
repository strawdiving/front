import request from './request'
import axios from "axios/index";

export function getConfigs() {
  return request({
    url: '/api/config/init',
    method: 'get',
  })
}

export function getFunctionList() {
  return request({
    url: '/api/config/functions',
    method: 'get'
  })
}

export function getModbusList() {
  return request({
    url: '/api/config/modbus',
    method: 'get'
  })
}

export function getCoords() {
  return request({
    url: '/api/config/coordinates',
    method: 'get'
  })
}

export function getUserList() {
  return request({
    url: '/api/config/users',
    method: 'get'
  })
}
