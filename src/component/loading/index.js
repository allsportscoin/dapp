import Loading from './App.vue';
const app = {
    install: function (Vue) {
        Vue.component('Loading', Loading);
    }
};
if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.component('Loading', Loading);
}
export default app;
