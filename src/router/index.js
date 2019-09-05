import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/home/Home'

Vue.use(Router)

export const constantRouterMap = [
  {
    path: '/redirect',
    component: Home,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/init',
    name: 'init',
    component: () => import('@/views/init'),
    hidden: true
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/errorPage/404'),
    hidden:true
  },
  {
    path: '',
    component: Home,
    redirect: 'dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: {
          noCache: true
        }
      }
    ]
  }
]

export default new Router({
  // routes: constantRouterMap
  routes: [
    // {
    //   path: '/redirect',
    //   component: Home,
    //   hidden: true,
    //   children: [
    //     {
    //       path: '/redirect/:path*',
    //       component: () => import('@/views/redirect/index')
    //     }
    //   ]
    // },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/login/index'),
      hidden: true
    },
    {
      path: '/init',
      name: 'init',
      component: () => import('@/views/init'),
      hidden: true
    },
    {
      path: '/404',
      name: '404',
      component: () => import('@/views/errorPage/404'),
      hidden:true
    },
    {
      path: '',
      component: Home,
      redirect: 'dashboard',
      children: [
        {
          path: 'dashboard',
          component: () => import('@/views/dashboard/index'),
          name: 'Dashboard',
          meta: {
            noCache: true
          }
        }
      ]
    },

     { path: '/program',
       component: Home,
       children: [
         {
           path: '',
           name: 'Program',
           component: () => import('@/views/program/index')
         }
      ]
     },
     { path: '/status',
       component: Home,
       children: [
         {
           path: '',
           name: 'Status',
           component: () => import('@/views/status/Status')
         }
       ]
     },
    {
      path: '/settings',
      component: Home,
      children: [
        {
          path: '',
          name: 'Settings',
          component: () => import('@/views/settings/Settings')
        }
      ]
    }
    ]
})

export const normalRouterMap = [
  {
    path: '/status',
    component: Home,
    meta: {
      roles: ['user'],
      title: 'status',
      icon: 'el-icon-info'
    },
    children: [
      {
        path: '',
        name: 'Status',
        component: () => import('@/views/status/Status')
      }
    ]
  },
  {
    path: '/run',
    component: Home,
    meta: {
      roles: ['user'],
      title: 'run',
      icon: 'el-icon-caret-right'
    },
    children: [
      {
        path: '',
        name: 'Run',
        component: () => import('@/views/run/Run')
      }
    ]
  }
]

export const asyncRouterMap = [
  {
    path: '/program',
    component: Home,
    meta: {
      roles: ['superAdmin','admin'],
      title: 'program',
      icon: 'el-icon-edit-outline'
    },
    children: [
      {
        path: '',
        name: 'Program',
        component: () => import('@/views/program/index')
      }
    ]
  },
  {
    path: '/settings',
    component: Home,
    meta: {
      roles: ['superAdmin','admin'],
      title: 'settings',
      icon: 'el-icon-setting'
    },
    children: [
      {
        path: '',
        name: 'Settings',
        component: () => import('@/views/settings/Settings')
      }
    ]
  },
  // {
  //   path: '/init',
  //   name: 'init',
  //   component: () => import('@/views/init'),
  //   hidden: true
  // },
  // { path: '*', redirect: '/404', hidden: true }
]

export const superRouterMap = [
  {
    path: '/users',
    component: Home,
    meta: {
      roles: ['superAdmin'],
      title: 'users',
      icon: 'el-icon-edit-outline'
    },
    children: [
    {
      path: '',
      name: 'Users',
      component: () => import('@/views/users/index')
    }
  ]
},
]
