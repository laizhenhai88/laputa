import Vue from 'vue';
import VueResource from 'vue-resource';
import VueRouter from 'vue-router';
import Routers from './appRouter';
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'
import components from './components/components';
import AppIndex from './AppIndex';

Vue.directive('title', {
  inserted: function(el, binding) {
    document.title = binding.value
  }
});

Vue.use(VueResource);
Vue.use(VueRouter);
Vue.use(MintUI);
Vue.use(components);

// 路由配置
const router = new VueRouter({
  routes: Routers,
  mode: 'hash',
});

new Vue({
  el: '#app',
  router,
  render: h => h(AppIndex)
});
