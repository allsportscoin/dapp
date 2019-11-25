'use strict';
const glob = require('glob');
const path = require('path');
const utils = require('./utils');
const config = require('../config');
const vueLoaderConfig = require('./vue-loader.conf');
const argv = require('yargs').argv;
let page = '';
if (argv.m) {
    page = argv.m + '/';
}

const js = glob.sync(`./src/pages/**/${page}index.js`).reduce(function (prev, curr) {
    prev[curr.slice(6, -3)] = [curr];
    return prev;
}, {});

function resolve (dir) {
    return path.join(__dirname, '..', dir);
}

const createLintingRule = () => ({
    test: /\.(js|vue)$/,
    loader: 'eslint-loader',
    enforce: 'pre',
    include: [resolve('src'), resolve('test')],
    options: {
        formatter: require('eslint-friendly-formatter'),
        emitWarning: !config.dev.showEslintErrorsInOverlay
    }
})

module.exports = {
    entry: js,
    output: {
        path: config.build.assetsRoot,
        publicPath: process.env.NODE_ENV === 'production' ? config.build.assetsPublicPath : config.dev.assetsPublicPath,
        filename: '[name].js'
    },
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
            '@': resolve('src')
        }
    },
    module: {
        rules: [
            ...(config.dev.useEslint ? [createLintingRule()] : []),
            {
                test: /\.(js|vue)$/,
                loader: 'eslint-loader',
                enforce: 'pre',
                include: [resolve('src'), resolve('test')],
                options: {
                    formatter: require('eslint-friendly-formatter')
                }
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: vueLoaderConfig
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                include: [resolve('src'), resolve('test'), resolve('node_modules/js-promisify/')],
                options: {
                    presets: ['es2015']
                }
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    outputPath: function (_path) {
                        return _path.substring(4); // remove 'src/' in output path
                    },
                    name: utils.assetsPath('[path][name].[hash:7].[ext]')
                }
            },
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    outputPath: function (_path) {
                        return _path.substring(4); // remove 'src/' in output path
                    },
                    name: utils.assetsPath('[path][name].[hash:7].[ext]')
                }
            },
            {
                test: /\.(woff2?|eot|ttf|ttc|otf)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    outputPath: function (_path) {
                        return _path.substring(4); // remove 'src/' in output path
                    },
                    name: utils.assetsPath('[path][name].[hash:7].[ext]')
                }
            },
            {
                test: /\.(html)$/,
                loader: 'ejs-compiled-loader',
            }
        ]
    }
};
