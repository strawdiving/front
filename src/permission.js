import {Message} from 'element-ui'
import router from './router'
import store from './store'
import {getToken} from "@/utils/auth"

router.beforeEach((to,from,next) => {
  if(getToken()) { // determine if there is token
    /*has token */
    if(to.path === '/login') {
      next({path: '/'})
    }
    else {
      if(store.getters.roles.length === 0) { //判断当前用户是否已拉完user_info信息
        store.dispatch('getUserInfo').then(response => {
          const roles = response.data.roles // roles is an Array
            store.dispatch('GenerateRouters',{roles}).then(() => {// 根据roles权限生成可访问的路由表
              router.addRoutes(store.getters.addRouters)// 动态添加可访问路由表routers
              // next()
              next({ ...to, replace: true }) // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
            })
        }).catch((err) => {
          store.dispatch('FedLogOut').then(() => {
            Message.error(err || 'Verification failed, please login again')
            next({ path: '/' })
          })
        })
      }
      else {
        // 没有动态改变权限的需求的，可以直接next()
        next()
      }
    }
  }
  else {
    // 没有token
    if(to.path === '/login') {
      next()
    } else {
      next(`/login?redirect=${to.path}`) // 否则全部重定向到登录页
      // next('/login')
    }
  }
})
