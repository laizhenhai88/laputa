// 组件注册
const components = [
    'App',
];

export default {
    install: (Vue) => {
        components.forEach((c)=>{
            Vue.component(
                c,
                () => import(`./${c}`)
            );
        });
    }
}