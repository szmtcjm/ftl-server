var express = require('express');
var path = require('path');
var router = express.Router('strict');
var config = require('../lib/config');
var ftl = require('../lib/ftl');
var mock = require('../lib/mock');

function pathJoinPublic(static) {
    return path.join(config.public, static);
}
router.use('/js', express.static(pathJoinPublic('js')));
router.use('/css', express.static(pathJoinPublic('css')));
router.use('/images', express.static(pathJoinPublic('images')));

//根目录跳转到ftl
router.use(function(req, res, next) {
    if (req.path === '/' || req.path === '/ftl') {
        res.redirect(301, '/ftl/');
    } else {
        next();
    }
});

router.use('/ftl/', ftl);
router.use(mock);
// app.use(proxy);



// catch 404 and forward to error handler
router.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

//如果是ajax错误，返回json信息
function xhrErrorHandler(err, req, res, next) {
    res.status(err.status || 500);
    if (req.xhr) {
      res.send({
          message: err.message,
          error: err
      });
    } else {
      next(err);
    }
}

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
