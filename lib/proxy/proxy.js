var http = require('http');
var https = require('https');
var url = require('url');

module.exports = function(target) {
    var parsedUrl = url.parse(target);
    return function(req, res, next) {
        var targetUrl = target;
        if (req.path !== '/') {
            target = target.charAt(target.length - 1) === '/' ? target : target + '/'
            targetUrl = url.reslove(target, req.path === '/' ? '' : req.path);
        }
        parsedUrl.method = req.method;
        (parsedUrl.protocol === 'https' ? https : http).request();
    }
}
