// 组件注册
const components = [
];

export default {
    install: (Vue) => {
        // 组件动态注册
        components.forEach((c)=>{
            Vue.component(
                c,
                () => import(`./${c}`)
            );
        });
    }
}