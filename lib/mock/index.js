var express = require('express');
var mockConfig = require('../config').mock;
var router = express.Router();

mockConfig = mockConfig || [];

mockConfig.forEach(function(mock) {
    var url = mock.url;
    var method = mock.method || 'get';
    router[method](url, function(req, res, next) {
        var response = mock.response;
        var isJsonp = !!mock.jsonp;
        var send;
        var ContentType;
        if (!isJsonp) {
            send = res.send.bind(res);
            ContentType = 'Application/json';
        } else {
            typeof mock.jsonp === 'string' && mock.jsonp !== 'true' 
                && req.app.set('jsonp callback name', mock.jsonp);
            send = res.jsonp.bind(res);
            ContentType = 'application/javascript; charset=UTF-8';
        }

        res.status(mock.status || 200);

        res.set(mock.header || {});
        res.set({
            'Content-Type': mock.ContentType || ContentType,
        });

        if (typeof response === 'function') {
            response = response(req, res);
        }
        if (!res.headersSent && !mock.delay) {
            send(response);
        }

        if (!res.headersSent && mock.delay) {
            if (Number.isNaN(Number(mock.delay))) {
                var err = new Error('config: mock.delay must a number');
                console.log(err);
                next(err)
                return;
            }
            process.nextTick(function() {
                send(response);
            }, mock.delay);
        }
    });
});

module.exports = router;