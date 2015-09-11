var fs = require('fs');
var path = require('path');
var iconv = require("iconv-lite");
var Promise = require('es6-promise').Promise;
var QRCode = require('qrcode-js');
var os = require('os');
var addLogType = require('../logger').addLogType;
var config = require('../config');
var list = require('../list');
var ftl = require('./ftl');
var ipList = require('../ipList.js');

module.exports = function(req, res, next) {
    var filePath = path.join(config.ftlBase, req.path);
    function render() {
        if (/.*\.ftl$/.test(filePath)) {
            ftl.render(req.path, {req: req, res: res}, function(stdout, stderr) {
                res.set('Content-Type', 'text/html; charset=utf-8');
                stdout.pipe(res);
                if (config.log.error || config.log.all) {
                    stderr.on('data', function(err) {
                        console.error(err);
                    });
                }
            });
        } else {
            res.sendFile(filePath, {
                maxAge: 0
            });
        }
    }

    new Promise(function(resolve, reject) {
        fs.lstat(filePath, function(err, stats) {
            if (err) {
                reject(err);
            } else {
                addLogType(req, 'ftl');
                resolve(stats)
            }
        });
    })
    .then(function(stats) {
        if (stats.isDirectory()) {
            return list(filePath, req.path);
        } else if (stats.isFile()) {
            render();
            return null;
        }
    })
    .then(function(result) {
        if (result !== null) {
            var data = {};
            req.path !== '/' && result.unshift('..');
            data.files = result;
            data.location = (req.path.charAt(req.path.length - 1) == '/' ? req.path : req.path + '/');
            var url = req.protocol + '://' +  req.headers.host + req.originalUrl
            data.dataUrl = QRCode.toDataURL(url, 4);
            data.ips = getIps(req);
            res.set('Content-Type', 'text/html; charset=utf-8');
            res.render('index', data);
        }
    })
    .catch(function(err) {
        if (err.code === 'ENOENT') {
            next();
        } else {
            res.render('error', {
                status: 500,
                message: err.message,
                error: err
            });
        }
    });

};

function getIps(req) {
    var port = (req.app.get('port') == '80' ? '' : ':' + req.app.get('port'));
    var result = [];
    for (var i = 0, len = ipList.length; i < len; i++) {
        result.push({ip: ipList[i], url: req.protocol + '://' +  ipList[i] + port +  req.originalUrl});
    }

    if (req.hostname !== 'localhost') {
        result.push({ip: 'localhost', url: req.protocol + '://' +  'localhost' + port + req.originalUrl});
    }
    return result;
}
