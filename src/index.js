import Vue from 'vue';
import components from './components/components'

Vue.use(components);
new Vue({
    el: '#app',
    render: function (createElement) {
        return createElement('App');
    }
});