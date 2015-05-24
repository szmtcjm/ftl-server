var express = require('express');
var path = require('path');
var http = require('http');
var debug = require('debug')('ftl-server:server');
var routes = require('./routes/index');
var config = require('./lib/config');
var live = require('./lib/live');

var app = express();
var server = http.createServer(app);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// live reload
app.use(live(server));

app.use(routes);

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
  console.log('Listening on ' + bind);
}

module.exports = app;