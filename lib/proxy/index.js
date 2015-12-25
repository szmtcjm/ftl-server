var router = require('express').Router();
var proxyConfig = require('../config').proxy;
var proxy = require('./proxy');
var colors = require('colors');
var url = require('url');
var defaultProxy = require('./defaultProxy');

proxyConfig = (proxyConfig || []).concat(defaultProxy);
proxyConfig.forEach(function(option) {
    if (!option.path || !option.target) {
        console.log(colors.red.bold('proxy config must contains both path and target'));
        process.exit(1);
    }

    router.use(option.path, proxy(option));
});

module.exports = router;
