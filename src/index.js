import Vue from 'vue';
import VueResource from 'vue-resource';
import VueRouter from 'vue-router';
import Routers from './router';
import iView from 'iview';
import 'iview/dist/styles/iview.css';
import components from './components/components';
import App from './App';

Vue.directive('title', {
  inserted: function(el, binding) {
    document.title = binding.value
  }
});

Vue.use(VueResource);
Vue.use(VueRouter);
Vue.use(iView);
Vue.use(components);

// 路由配置
const router = new VueRouter({
  routes: Routers,
  mode: 'hash',
  // scrollBehavior(to, from, savedPosition) {
  //   if (savedPosition) {
  //     return savedPosition
  //   } else {
  //     return {
  //       x: 0,
  //       y: 0
  //     }
  //   }
  // }
});

new Vue({
  el: '#app',
  router,
  render: h => h(App)
});
