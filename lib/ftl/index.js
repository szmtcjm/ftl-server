var fs = require('fs');
var path = require('path');
var router = require('express').Router();
var Promise = require('es6-promise').Promise;
var config = require('../config');
var list = require('./list');
var ftl = require('./ftl');

//ftl目录为配置的base字段，如果未配置则为当前工作目录
var base = config.base || process.cwd();

router.get (/.*\.ftl$/, function(req, res, next) {
    var filePath = path.join(base, req.path);
    function render() {
        return new Promise(function(resolve, reject) {
            console.log(/.*\.ftl$/.test(filePath))
            if (/.*\.ftl$/.test(filePath)) {
                ftl.render(filePath, {req: req, res: res}, function(stdout) {
                    stdout.on('error', function(err) {
                        reject(err);
                    });
                    stdout.on('end', function() {
                        
                    });
                    res.set('Content-Type', 'text/html');
                    stdout.pipe(res);
                    resolve(null);
                });
            } else {
                res.sendFile(filePath, {
                    maxAge: 0
                });
            }
        });
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
            return render();
        }
    })
    .then(function(result) {
        if (result !== null) {
            var data = {};
            data.location = req.path;
            data.files = result;
            res.render('index', data);
        }
    })
    .catch(function(err) {
        res.render('error', {
            status: 500,
            message: err.message,
            error: err
        });
    });

});

module.exports = router;