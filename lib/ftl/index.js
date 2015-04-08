var fs = require('fs');
var path = require('path');
var iconv = require("iconv-lite");
var Promise = require('es6-promise').Promise;
var ftlConfig = require('../config').ftl;
var list = require('../list');
var ftl = require('./ftl');

//ftl目录为配置的base字段，如果未配置则为当前工作目录
var base = ftlConfig.base || process.cwd();

module.exports = function(req, res, next) {
    var filePath = path.join(base, req.path);
    function render() {
        if (/.*\.ftl$/.test(filePath)) {
            ftl.render(req.path, {req: req, res: res}, function(stdout) {
                res.set('Content-Type', 'text/html; charset=utf-8');
                stdout.pipe(res);
                stdout.on('error', function(err) {
                    console.log(err);
                });
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
            data.location = req.path;
            data.files = result;
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

