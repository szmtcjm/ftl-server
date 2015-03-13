var express = require('express');
var mockConfig = require('../config').mock;
var router = express.Router();

mockConfig = mockConfig || [];

mockConfig.forEach(function(mock) {
    var url = mock.url;
    var method = mock.method || 'get';
    router[method](url, function(req, res) {
        var response = mock.response;
        res.status(mock.status || 200);
        res.set({
            'Content-Type': mock.ContentType || 'Application/json',
        });
        res.set(mock.header || {});
        
        if (typeof response === 'function') {
            response = response(req, res);
        }

        if (!res.headersSent && !mock.delay) {
            res.send(response);
        }

        if (mock.delay) {
            if (Number.isNaN(Number(mock.delay))) {
                console.log('config: mock.delay must a number');
                res.send(response);
                return;
            }
            process.nextTick(function() {
                res.send();
            }, mock.delay);
        }
    });
});

module.exports = router;