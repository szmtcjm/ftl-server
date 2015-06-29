var express = require('express');
var config = require('../lib/config');
var router = express.Router('strict');

config.public.forEach(function(static) {
    router.use(express.static(static, {index: false, setHeaders: function(res, path) {
        if (/\.(ttf|ttc|otf|eot|woff|svg)$/.test(path)) {
            res.setHeader('Access-Control-Allow-Origin', '*');
        }
    }}));
});

module.exports = router;
