var http = require('http');
var https = require('https');
var url = require('url');

module.exports = function(target) {
    var parsedUrl = url.parse(target);
    return function(req, res, next) {
        var targetUrl = url.reslove(target, req.path === '/' ? '' req.path);
        parsedUrl.protocol
    }
}