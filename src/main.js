// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App'
import router from './router'
import store from './store/index'
// import './mock'
import _ from 'lodash/index'

import '@/assets/js/global.js'
import '@/assets/css/global.css';
import i18n from './lang'

import RobotModel from './components/Robot3D.vue'
import SvgIcon from './components/SvgIcon' //svg组件
import AsstDialog from '@/views/program/components/AsstDialog'
import '@/assets/iconfont/iconfont.css'

import './permission'
import dragFloat from './directive/dragFloat'

Vue.config.productionTip = false;
Vue.use(ElementUI,{
  i18n: (key, value) => i18n.t(key, value)
});

// router.beforeEach((to, from, next) => {
//   if (to.path === '/login') {
//     sessionStorage.removeItem('user')
//   }
//   console.log(sessionStorage.getItem('user'))
//
//   // let user
//   // if (sessionStorage.getItem('user') == undefined) {
//   //   user = null
//   // } else {
//   //   let user = JSON.parse(sessionStorage.getItem('user'))
//
//   // }
//   let user = JSON.parse(sessionStorage.getItem('user'))
//   if (!user && to.path !== '/login') {
//     next({path: '/login'})
//   } else {
//     next()
//   }
// })

Vue.directive('numberOnly', {
  bind: function (el) {
    el.handler = function () {
      el.value = el.value.replace(/[^\-?\d.]/g, '')
    };
    el.addEventListener('input', el.handler)
  },
  unbind: function (el) {
    el.removeEventListener('input', el.handler)
  }
});
Vue.directive('hex', {
  inserted: function (el) {
    console.log(el.value)
    el.handler = function () {
      el.value = el.value.replace(/[^\d]/g, '')
    };
    el.addEventListener('input', el.handler)
  },
  unbind: function (el) {
    el.removeEventListener('input', el.handler)
  }
})
Vue.directive('dragFloat', dragFloat)

Vue.component('robot-model',RobotModel)

Vue.component('svg-icon',SvgIcon)
Vue.component('asst-dialog', AsstDialog)

// 全局使用this._ 引用lodash
Vue.prototype._ = _

/* eslint-disable no-new */
new Vue({
  // el: '#app',
  router,
  store,
  i18n,
  render: h => h(App),
  // template: '<App/>'
}).$mount('#app');
