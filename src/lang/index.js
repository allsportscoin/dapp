import Vue from 'vue';
import VueI18n from 'vue-i18n';
import queryString from 'query-string';

Vue.use(VueI18n);

const DEFAULT_LANG = 'en';

const locales = {
    zh_tw: require('./zh_tw.js'),
    en: require('./en.js')
};

const i18n = new VueI18n({
    locale: DEFAULT_LANG,
    messages: locales
});

const setLocale = function () {
    const query = queryString.parse(location.search);
    const hash = location.hash && location.hash.split('?');
    const hashQuery = hash.length > 1 ? queryString.parse(hash[1]) : {};
    const pageParams = window.pageParams || {};

    Object.assign(query, hashQuery, pageParams);

    Vue.prototype.$query = query;

    let locale = query['language'];

    i18n.locale = locale || 'en';

    Vue.config.lang = i18n.locale;

    if (window.document && window.document.body) {
        let className = window.document.body.className;
        if (className.match(/locale-\w+/)) {
            window.document.body.className.replace(/locale-\w+/, 'locale-' + i18n.locale);
        } else {
            window.document.body.className += ' locale-' + i18n.locale;
        }
    }
};
setLocale();

export default i18n;
