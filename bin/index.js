#!/usr/bin/env node

var config = require('../lib/config');
var fs = require('fs');
var fork = require('child_process').fork;
var path = require('path');

var child = forkApp();

var watchFiles = (config.watch || []).concat(config.configPath);

watchFiles.forEach(function(file) {
    var filePath = path.resolve(path.dirname(config.configPath), file);
    //检测文件变化
    fs.watchFile(filePath, { interval: 2000 }, function(curr, prev) {
        if (curr.mtime !== prev.mtine) {
            child && child.kill();
        }
    });
});

function forkApp() {
    child = fork(path.join(__dirname, '..', 'app'), process.argv.slice(2));
    child.once('exit', function exitHander(code) {
        if (code === null) {
            child = forkApp();
        } else if (code === 1) {
            process.exit(1);
        }
    });
    return child;
}
