var express = require('express');
var path = require('path');
var http = require('http');
var logger = require('morgan');
var config = require('./lib/config');

var app = express();
var server = http.createServer(app);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// 日志
app.use(require('./lib/logger'));
// live reload
app.use(require('./lib/live')(server));
// 静态资源
app.use(require('./lib/static'));
//反向代理
app.use(require('./lib/proxy')); 
//ftl渲染
app.use(require('./lib/ftl'));
// api mock
app.use(require('./lib/mock'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

//如果是ajax错误，返回json信息
app.use(function(err, req, res, next) {
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
app.use(function(err, req, res, next) {
    err.status = err.status || 500;
    res.status(err.status);
    res.render('error', {
        message: err.message,
        error: err
    });
});

// set port
var port = config.port;
app.set('port', port);

// listening
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

// error
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

// listening handler
function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  console.log('Start ftl-server listening on ' + bind);
}

module.exports = app;