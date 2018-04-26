// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import './config/rem'
import './config/formatDate'
import axios from 'axios'
import Mint from 'mint-ui'
import 'mint-ui/lib/style.css'
import 'normalize.css'
import './style/common.css'
import {
  MessageBox
} from "mint-ui";


Vue.filter('capitalize', function (value) {
  if (value) {
    return value.slice(5, 16);
  } else {
    return value;
  }
})
Vue.config.productionTip = false
/* eslint-disable no-new */
// 验证登录状态
router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth) {
    if (sessionStorage.getItem('token')) {
      next();
    } else {
      next({
        path: '/'
      })
    }
  } else {
    next();
  }
})

// 主要拦截token过期和实效时候的状态码，然后返回登录页面
axios.interceptors.response.use(
  response => {
    if (response.data.code == 4007 || response.data.code == 1004 || response.data.code == 1005) {
      MessageBox("温馨提示", "登录信息过期,请重新登录").then(action => {
        router.replace({
          path: '/',
        })
        sessionStorage.clear();
      })
    }
    return response;
  },
  error => {
    return Promise.reject(error.response.data)
  });
Vue.use(Mint);
new Vue({
  el: '#app',
  router,
  components: {
    App
  },
  template: '<App/>'
})
