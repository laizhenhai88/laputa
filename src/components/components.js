import App from './App';
// 组件注册
const components = [
];

export default {
    install: (Vue) => {
        // 单独静态注册App
        Vue.component('App', App);
        // 其它组件动态注册
        components.forEach((c)=>{
            Vue.component(
                c,
                () => import(`./${c}`)
            );
        });
    }
}