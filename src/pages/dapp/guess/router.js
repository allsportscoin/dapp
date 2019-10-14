import Vue from 'vue';
import VueRouter from 'vue-router';
import List from './component/List.vue';
import Detail from './component/Detail.vue';

Vue.use(VueRouter);
const routes = [
    {
        path: '/',
        component: List,
        name: 'guessList'
    },
    {
        path: '/detail',
        component: Detail,
        name: 'guessDetail'
    }
];
const router = new VueRouter({
    mode: 'hash',
    routes
});
export default router;
