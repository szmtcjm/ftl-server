var express = require('express');
var url = require('url');
var mockConfig = require('../config').mock;
var router = express.Router();

mockConfig = mockConfig || [];

mockConfig.forEach(function(mock) {
    var path = url.parse(mock.path || mock.url).pathname;
    var method = (mock.method || 'get').toLowerCase();
    var isJsonp = !!mock.jsonp;
    if (!isJsonp) {
        router[method](path, require('./json')(mock));
    } else {
        router[method](path, require('./jsonp')(mock));
    }
});

module.exports = router;