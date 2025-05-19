import Vue from 'vue'
import App from './App.vue'
import store from './store'
// eslint-disable-next-line no-unused-vars
import $ from 'jquery'
import "popper.js"
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.min'
import './style/main.css'
import router from './router'
import {postRequest, putRequest} from "@/api/api";
// import {getToken} from "@/api/auth";
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'; // 引入样式

Vue.config.productionTip = false;
Vue.prototype.postRequest = postRequest;
Vue.prototype.putRequest = putRequest;
Vue.use(ElementUI);

$('[data-toggle="tooltip"]').tooltip();

router.beforeEach( (to, from, next) => {
  document.title = to.meta.title ? to.meta.title : '加载中...';
  next();
});



new Vue({
  render: h => h(App),
  store,
  router,
}).$mount('#app');

