var http = require('http');
var https = require('https');
var url = require('url');
var assign = require('object-assign');
var querystring = require('querystring');

var redirectCode = {301:true, 302:true, 303: true, 305: true, 407: true}
module.exports = function(option) {
    var pathRegExp = new RegExp(option.path).com
    return function(req, res, next) {
        var parsedTarget = url.parse(option.target);
        var request = (parsedTarget.protocol === 'https:' ? https : http)
            .request(targetOption(req, parsedTarget, option));
        request.on('error', function(err) {
            res.send(err);
        });
        request.on('response', function(targetRes) {
            if (targetRes.statusCode in redirectCode) {
                redirect(targetRes.headers.location, req, res, 0);
                return;
            }
            res.writeHead(targetRes.statusCode, targetRes.statusMessage, targetRes.headers);
            targetRes.pipe(res);
        });
        req.pipe(request);
    }
}

function targetOption(req, parsedTarget, option) {
    var parsedOrigin = url.parse(req.originalUrl);

    if (new RegExp(option.path).test(parsedOrigin.path)) {
        parsedTarget.path += parsedOrigin.path.replace(option.path, '');
    } else {
        parsedTarget.path += parsedOrigin.path.replace(option.path.slice(0, -1), '');
    }
    parsedTarget.path = parsedTarget.path.replace('//', '/');

    parsedTarget.method = req.method;
    parsedTarget.headers = assign({}, req.headers);
    parsedTarget.headers.host = option.host ? option.host : parsedTarget.hostname;

    return parsedTarget;
}


function redirect(location, req, res, redirectCount) {
    if (++redirectCount > 5) res.send('redirect infinite loop');

    var protocol = (location.substr(0, 5) === 'https' ? https : http);
    var parsedLocation = url.parse(location);

    parsedLocation.headers = assign({}, req.headers);
    parsedLocation.headers.host = parsedLocation.hostname;
    parsedLocation.method = 'GET';

    var request = protocol.request(parsedLocation);

    request.on('error', function(err) {
        res.send(err);
    });
    request.on('response', function(targetRes) {
        if (targetRes.statusCode in redirectCode) {
            redirect(targetRes.headers.location, req, res, redirectCount);
            return;
        }
        res.writeHead(targetRes.statusCode, targetRes.statusMessage, targetRes.headers);
        targetRes.pipe(res);
    });
    request.end();
}