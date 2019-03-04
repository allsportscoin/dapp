// es6-polyfill.js
import 'core-js/es6/array';
import 'core-js/es6/function';
import 'core-js/es6/map';
import 'core-js/es6/math';
import 'core-js/es6/number';
import 'core-js/es6/object';
import 'core-js/es6/promise';
import 'core-js/es6/regexp';
import 'core-js/es6/string';
import 'core-js/fn/array/includes';
// 加载通用css
import 'normalize.css';
import './base.less';

import './utils/flexible';

import Vue from 'vue';

import 'vue2-toast/lib/toast.css';
import Toast from 'vue2-toast';

import qs from 'qs';
import axios from 'axios';

// import * as localTest from './_test.jsx'; // todoWWY---------------------------------------------------

// Element `remove` polyfill, 修复vue2 toast在4.2及以下的兼容性bug
// from:https://github.com/jserz/js_piece/blob/master/DOM/ChildNode/remove()/remove().md
(function (arr) {
    arr.forEach(function (item) {
        if (item.hasOwnProperty('remove')) {
            return;
        }
        Object.defineProperty(item, 'remove', {
            configurable: true,
            enumerable: true,
            writable: true,
            value: function remove () {
                this.parentNode.removeChild(this);
            }
        });
    });
})([Element.prototype, CharacterData.prototype, DocumentType.prototype]);

Vue.use(Toast, {
    defaultType: 'center',
    duration: 3000,
    wordWrap: true
});
axios.interceptors.request.use((config) => {
    if (config.method === 'post') {
        Object.assign(config.data || {});
        config.data = qs.stringify(config.data);
        config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});
Vue.prototype.$http = axios;
