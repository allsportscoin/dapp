module.exports = [
    {
        uri: '/__webpack_hmr',
        template: '/__webpack_hmr',
        data: null
    },
    {
        uri: /^\/([\w-_]+)$/,
        template: '/pages/$1/index.html',
        data: null
    },
    {
        uri: /^\/dapp\/([\w-_]+)$/,
        template: '/pages/dapp/$1/index.html',
        data: null
    },
];
