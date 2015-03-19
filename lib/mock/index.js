var express = require('express');
var mockConfig = require('../config').mock;
var router = express.Router();

mockConfig = mockConfig || [];

mockConfig.forEach(function(mock) {
    var url = mock.url;
    var method = (mock.method || 'get').toLowerCase();
    var isJsonp = !!mock.jsonp;
    if (!isJsonp) {
        router[method](url, require('./json')(mock));
    } else {
        router[method](url, require('./jsonp')(mock));
    }
});

module.exports = router;