import Vue from 'vue';
import VueRouter from 'vue-router';
import Dice from './component/Dice.vue';

Vue.use(VueRouter);
const routes = [
    {
        path: '/',
        component: Dice,
        name: 'dice'
    }
];
const router = new VueRouter({
    mode: 'hash',
    routes
});
export default router;
