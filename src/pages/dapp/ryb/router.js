import Vue from 'vue';
import VueRouter from 'vue-router';
import List from './component/List.vue';
import Detail from './component/Detail.vue';

Vue.use(VueRouter);
const routes = [
    {
        path: '/',
        component: List,
        name: 'rybList'
    },
    {
        path: '/detail',
        component: Detail,
        name: 'rybDetail'
    }
];
const router = new VueRouter({
    mode: 'hash',
    routes
});
export default router;
