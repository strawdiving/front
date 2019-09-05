
import {constantRouterMap, normalRouterMap, asyncRouterMap, superRouterMap} from "../../router"

const permission = {
  state: {
    routers: constantRouterMap,
    normalRouters: normalRouterMap,
    addRouters: normalRouterMap
  },
  mutations: {
    SET_ROUTERS: (state,routers) => {
      state.addRouters = state.normalRouters.concat(routers)
      state.routers = constantRouterMap.concat(state.addRouters)
    }
  },
  actions: {
    GenerateRouters({commit},data) {
      return new Promise(resolve => {
        const { roles } = data
        let accessedRouters
        if(roles.includes('superAdmin')) {
          accessedRouters = asyncRouterMap.concat(superRouterMap)
        }
        else if(roles.includes('admin')) {
          accessedRouters = asyncRouterMap
        }
        else {
          accessedRouters = []
        }
        commit('SET_ROUTERS',accessedRouters)
        resolve()
      })
    }
  }
}

export default permission
