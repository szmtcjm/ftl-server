var router = require('express').Router();
var config = require('../config');
var chokidar = require('chokidar');
var WebSocketServer = require('ws').Server;
var join = require('path').join;
var injectScript = require('../injectScript.js');

router.get('/ftl-server/live-client.js', function(req, res) {
    res.sendFile(join(__dirname, 'live-client.js'));
});

router.use(function(req, res, next) {
    injectScript(req, res, '<script async defer src="/ftl-server/live-client.js"></script>');
    next();
});

function websocket(server) {
    var wss = new WebSocketServer({
        server: server
    });

    wss.on('connection', function connection(ws) {
        ws.on('message', function incoming(message) {
            console.log('received: %s', message);
        });
    });

    wss.broadcast = function broadcast(data) {
        wss.clients.forEach(function each(client) {
            client.send(data, function(error) {
                if (error) {
                    console.log(error);
                }
            });
        });
    };

    var watchDirs = config.public.concat(config.ftlBase);
    watchDirs.forEach(function(dir) {
        watchDirAndBroadcast(dir, wss)
    });
    server.wss = wss;
}

function watchDirAndBroadcast(dir, wss) {
    chokidar.watch(dir, {ignored:['**/.git/**', '**/node_modules/**']}).on('change', function(path) {
        wss.broadcast(path.replace(dir, ''));
    });
}

module.exports = function(server) {
    if (!config.hot) {
        return function(req, res, next) {
            next();
        }
    } else {
        websocket(server);
        return router;
    }
}
