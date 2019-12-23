'use strict';
const config = require('../config');
if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV);
}

const opn = require('opn');
const path = require('path');
const express = require('express');
const webpack = require('webpack');
const proxyMiddleware = require('http-proxy-middleware');
const webpackConfig = require('./webpack.dev.conf');

// default port where dev server listens for incoming traffic
const port = process.env.PORT || config.dev.port;
// automatically open browser, if not set will be false
const autoOpenBrowser = !!config.dev.autoOpenBrowser;
// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware

const app = express();
const compiler = webpack(webpackConfig);

// compiler.plugin('compilation', function (compilation) {
//     // handler the
//     compilation.plugin('html-webpack-plugin-before-html-processing', function(htmlPluginData, cb) {
//         htmlPluginData.html = htmlPluginData.html.replace(/\{{3}[\w\d_]+\}{3}/g, '');
//         cb();
//     });

//     // force page reload when html-webpack-plugin template changes
//     // currently disabled until this is resolved:
//     // https://github.com/jantimon/html-webpack-plugin/issues/680
//     // compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
//     //     hotMiddleware.publish({ action: 'reload' })
//     //     cb()
//     // })
// })

const devMiddleware = require('webpack-dev-middleware')(compiler, {
    publicPath: webpackConfig.output.publicPath,
    quiet: false
});

const hotMiddleware = require('webpack-hot-middleware')(compiler, {
    log: false,
    heartbeat: 2000
});

// rewrite url to compliation with online
const routers = require('../routers/index');

app.use(function(req, res, next) {
    const route = routers(req, res);
    if (route) {
        req.url = route.template;
    }

    next();
});

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware);

// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')());

// serve webpack bundle output
app.use(devMiddleware);

// serve pure static assets
const staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory);
app.use(staticPath, express.static('./static'));

const uri = 'http://localhost:' + port;

var _resolve;
var _reject;
var readyPromise = new Promise((resolve, reject) => {
    _resolve = resolve;
    _reject = reject;
});

var server;
var portfinder = require('portfinder');
portfinder.basePort = port;

console.log('> Starting dev server...');
devMiddleware.waitUntilValid(() => {
    portfinder.getPort((err, port) => {
        if (err) {
            _reject(err);
        }
        process.env.PORT = port;
        var uri = 'http://localhost:' + port;
        console.log('> Listening at ' + uri + '\n');
        // when env is testing, don't need open it
        // if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
        //     opn(uri);
        // }
        server = app.listen(port);
        _resolve();
    });
});

module.exports = {
    ready: readyPromise,
    close: () => {
        server.close();
    }
};
