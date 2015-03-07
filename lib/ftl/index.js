var fs = require('fs');
var route = require('express').Route();
var Promise = require('es6-promise');
var config = require('../config');
var list = require();

var base = config.base;

route.use(function(req, res, next) {
    var path = base + req.path.substring(4);
    new Promise(function(resolve, reject) {
        fs.stat(path, function(err, stats) {
            if (err) {
                reject(err);
            } else {
                resolve(stats)
            }
        });
    })
    .then(function(stats) {
        if (stats.isDirectory()) {
            return list(path, req.path);
        } else if (stats.isFile()) {
            res.sendFile(path);
        }
    })
    .then(function(data) {
        res.render('index', data);
    })
    .catch(function(err) {
        res.render('error', {
            status: 500,
            message: err.message
        });
    });

});