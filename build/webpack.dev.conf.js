'use strict';
var glob = require('glob');
const utils = require('./utils');
const webpack = require('webpack');
const config = require('../config');
const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.conf');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Px2remWebpackPlugin = require('px2rem-webpack-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const argv = require('yargs').argv;
let page = '';
if (argv.m) {
    page = argv.m + '/';
}

// add hot-reload related code to entry chunks
Object.keys(baseWebpackConfig.entry).forEach(function (name) {
    baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name]);
});

const html = glob.sync(`./src/pages/**/${page}index.html`).map(function (item) {
    return new HtmlWebpackPlugin({
        data: {
            build: false
        },
        filename: item.substr(6),
        template: item,
        inject: true,
        minify: false,
        chunks: [ 'manifest', item.substring(6).slice(0, -5) ]
    });
});

module.exports = merge(baseWebpackConfig, {
    module: {
        rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap })
    },
    // cheap-module-eval-source-map is faster for development
    devtool: '#cheap-module-eval-source-map',
    plugins: [
        new webpack.DefinePlugin({
            'process.env': config.dev.env
        }),
        // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        // https://github.com/ampedandwired/html-webpack-plugin
        ...html,
        new FriendlyErrorsPlugin()
    ]
});
