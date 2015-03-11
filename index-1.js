var express = require('express');
var logger = require('morgan');
var path = require('path');
var bodyParser = require('body-parser');
var routes = require('./routes/index');
var config = require('./lib/config');
var ftl = require('./lib/ftl');
// var proxy = require('./lib/proxy');
// var mock = require('./lib/mock');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(config.public));

//根目录跳转到ftl
app.get(['/'], function(req, res, next) {
    res.redirect('/ftl/');
});

app.use('/ftl', ftl);
// app.use(proxy);
// app.use(mock);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
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
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: err
    });
});

module.exports = app;