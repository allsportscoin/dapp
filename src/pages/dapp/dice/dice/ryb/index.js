import '@/base';
import Vue from 'vue';
import App from './App.vue';
import i18n from '../../../lang/index';
import router from './router';
import Loading from '../../../component/loading/index.js';
Vue.use(Loading);

/* eslint no-new:0 */
new Vue({
    i18n,
    el: '#app',
    router,
    template: '<App/>',
    components: { App }
});
