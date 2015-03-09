var fs = require('fs');
var path = require('path');
var router = require('express').Router();
var Promise = require('es6-promise').Promise;
var config = require('../config');
var list = require('./list');

var base = config.base || process.cwd();

router.use(function(req, res, next) {
    var filePath = path.join(base, req.path);
    new Promise(function(resolve, reject) {
        fs.stat(filePath, function(err, stats) {
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
            fs.createReadStream(filePath).pipe(res);
            return null;
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