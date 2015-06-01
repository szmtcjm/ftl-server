var fs = require('fs');
var path = require('path');
var iconv = require("iconv-lite");
var Promise = require('es6-promise').Promise;
var QRCode = require('qrcode');
var os = require('os');
var config = require('../config');
var list = require('../list');
var ftl = require('./ftl');

module.exports = function(req, res, next) {
    var filePath = path.join(config.ftlBase, req.path);
    function render() {
        if (/.*\.ftl$/.test(filePath)) {
            ftl.render(req.path, {req: req, res: res}, function(stdout, stderr) {
                res.set('Content-Type', 'text/html; charset=utf-8');
                stdout.pipe(res);
                if (config.log.error) {
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
            data.files = result;
            data.location = (req.path.charAt(req.path.length - 1) == '/' ? req.path : req.path + '/');
            return generateQrcode(req.protocol + '://' +  req.headers.host + req.originalUrl, data);
        }
    })
    .then(function(data) {
        var interfaces = os.networkInterfaces();
        var interName;
        var inter;
        var i;
        data.ips = [];
        for (interName in interfaces) {
            if (/^lo/.test(interName)) {
                continue;
            }
            inter = interfaces[interName];
            for (i in inter) {
                if (inter[i].family === 'IPv4') {
                    data.ips.push({ip: inter[i].address, url: req.protocol + '://' +  inter[i].address + req.app.get('port') +  req.originalUrl});
                }
            }
        }
        return data;
    })
    .then(function(data) {
        res.set('Content-Type', 'text/html; charset=utf-8');
        res.render('index', data);
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

function generateQrcode(url, data) {
    return new Promise(function(resolve, reject) {
        QRCode.toDataURL(url, function(err, dataUrl) {
            if (err) {
                reject(err);
            }else {
                data.dataUrl = dataUrl;
                resolve(data);
            }
        });
    });
}

