var http = require('http');
var server;
exports.start = function() {
    server = http.createServer(function(req, res) {
        if (req.url === '/') {
            res.writeHead(301, 'FOUND', {location: '/redirect1'});
            res.end();
        } else if (req.url === '/redirect1') {
            res.writeHead(302, 'FOUND', {location: 'http://localhost:3000/redirect2'});
            res.end();
        }  else if (req.url === '/redirect2') {
            res.end('redirect');
        }
        res.end('haha');
    }).listen(3000);
}

exports.stop = function() {
    server && server.close();
}