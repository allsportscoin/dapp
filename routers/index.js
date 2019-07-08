const { URL } = require('url');
const routers = require('./routers.js');

// uri, template, data
module.exports = function (req, res) {
    const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    const url = new URL(fullUrl);

    let template;
    let data = { query: {} };

    for (var key of url.searchParams.keys()) {
        data.query[key] = url.searchParams.get(key);
    }

    const parseData = (item) => {
        if (typeof item.data === 'function') {
            Object.assign(data, item.data(req, res));
        } else if (typeof item.data === 'object') {
            Object.assign(data, item.data);
        }
    };

    const shot = routers.some(item => {
        if (typeof item.uri === 'string' && url.pathname === item.uri) {
            template = item.template;
            parseData(item);
            return true;
        }

        if ((item.uri instanceof RegExp) && url.pathname.match(item.uri)) {
            parseData(item);
            template = url.pathname.replace(item.uri, item.template);
            return true;
        }

        return false;
    });

    return shot && {
        template,
        data
    };
};
