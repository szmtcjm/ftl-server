var router = require('express').Router();
var config = require('../config');
var chokidar = require('chokidar');
var WebSocketServer = require('ws').Server;
var join = require('path').join;

router.get('/ftl-server/live-client.js', function(req, res) {
    res.sendFile(join(__dirname, 'live-client.js'));
});

router.use(function(req, res, next) {
    var write = res.write;
    var end = res.end;
    res.write = function(chunk, encode) {
        var length = res.get('Content-length');
        var contentType = res.get('Content-Type');
        var script = '<script async src="/ftl-server/live-client.js"></script>';
        if (contentType && contentType.indexOf('text/html') !== -1) {
            if (Buffer.isBuffer(chunk)) {
                chunk = chunk.toString('utf-8');
            }
            if (chunk.indexOf('</head>') !== -1) {
                chunk = chunk.replace('</head>', script + '</head>');
                if (length) {
                    length = parseInt(length);
                    length += Buffer.byteLength(script);
                    console.log(req.path, length, res.headersSent)
                    !res.headersSent && res.set('Content-length', length);
                }
            }
            write.call(res, chunk, 'utf-8');
        } else {
            write.call(res, chunk, encode);
        }
    }
    res.end = function(chunk, encoding) {
        if (chunk != null) {
            this.write(chunk, encoding);
        }
        return end.call(res);
    };
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