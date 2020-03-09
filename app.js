'use strict';

var express = require('express');
var path = require('path');
var ejs = require('ejs');
var fs = require('fs');

var app = express();
var compression = require('compression');

ejs.delimiter = '$';
app.use(compression());

app.set('views', path.join(__dirname, 'dist'));
app.engine('html', ejs.__express);
app.set('view engine', 'html');

const routers = require('./routers');
app.set('etag', false);
app.use(function (req, res, next) {
    var state = {};
    state.Authorization = req.headers.Authorization || req.headers.authorization || '';
    state.UUID = req.headers.UUID || req.headers.uuid || '';
    const route = routers(req, res);

    if (route && fs.existsSync(path.join(__dirname, 'dist', route.template))) {
        Object.assign(state, route.data);
        res.render(route.template.substring(1).slice(0, -5), state);
    } else {
        next();
    }
});

app.use(function (req, res, next) {
    res.status(404)        // HTTP status 404: NotFound
    .send('Not found !');
});

const port = process.env.PORT || 8080;

app.listen(port, function () {
    console.log('app listen port ' + port);
});

module.exports = app;
