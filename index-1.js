var argv = require('./lib/argv');
var fs = require('fs');
var fork = require('child_process').fork;
var path = require('path');

var configPath = path.resolve(argv.c);

var child = forkApp();

fs.watchFile(configPath, function(curr, prev) {
    if (curr.mtime !== prev.mtine) {
        child && child.kill();
    }
})

function forkApp() {
    console.log('the ftl server starting');
    child = fork(path.join('bin', 'www'), process.argv.slice(2));
    child.on('exit', function() {
        child = forkApp();
    });
    return child;
}