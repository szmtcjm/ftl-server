var router = require('express').Router();
var proxyConfig = require('../config');
var proxy = require('./proxy');
var url = require('url');

proxyConfig = proxyConfig || [];

proxyConfig.forEach(function(option) {
    if (!option.path || !option.target) {
        console.log('proxy config must contains both path and target');
        process.exit(1);
    }

    router.use(option.path, proxy(option.target));
});
