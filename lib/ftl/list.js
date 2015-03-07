var Promise = require('es6-promise');
var fs = require('fs');

module.exports = function(realPath, reqPath) {
    return new Promise(function(resolve, reject) {
        fs.readdir(realPath, function(err, files) {
            var data = {};
            var i;
            if (err) {
                reject(err);
            } else {
                data.location = reqPath.substring(4);
                var list = data.list = [];
                for (i in files) {
                    list[i] = {
                        name: files[i],
                        link: files[i]
                    }
                }
                resolve(data);
            }
        });
    });
}