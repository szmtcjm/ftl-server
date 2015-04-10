var express = require('express');
var path = require('path');
var router = express.Router('strict');
var config = require('../lib/config');
var ftl = require('../lib/ftl');
var mock = require('../lib/mock');
var proxy = require('../lib/proxy');

//静态资源
router.use(express.static(config.public, {index: false}));

router.use(ftl);   //ftl渲染
router.use(mock);  // api mock
router.use(proxy); //反向代理

// catch 404 and forward to error handler
router.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

//如果是ajax错误，返回json信息
router.use(function(err, req, res, next) {
    res.status(err.status || 500);
    if (req.xhr) {
        res.send({
            message: err.message,
            error: err
        });
    } else {
        next(err);
    }
});

// 其他错误, 404的话返回404页面
router.use(function(err, req, res, next) {
    err.status = err.status || 500;
    res.status(err.status);
    res.render('error', {
        message: err.message,
        error: err
    });
});

module.exports = router;
