var http = require('http');
var server;
exports.startForGET = function() {
    server = http.createServer(function(req, res) {
        // res.setHeader('url', req.url);
        // req.pipe(res);
        res.end(req.url);
    }).listen(3000);
}

exports.startForPOST = function() {
    server = http.createServer(function(req, res) {
        req.pipe(res);
    }).listen(3000);
}

exports.stop = function() {
    server && server.close();
}