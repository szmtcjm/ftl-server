#!/usr/bin/env node

var argv = require('../lib/argv');
var fs = require('fs');
var fork = require('child_process').fork;
var path = require('path');

var configPath = path.resolve(argv.c);

var child = forkApp();

//检测文件变化
fs.watchFile(configPath, { interval: 2000 }, function(curr, prev) {
    if (curr.mtime !== prev.mtine) {
        child && child.kill();
    }
})

function forkApp() {
    child = fork(path.join(__dirname, '..', 'app'), process.argv.slice(2));
    child.on('exit', function(code) {
        if (code === null) {
            child = forkApp();
        } else if (code === 1) {
            process.exit(1);
        }
    });
    return child;
}