var path = require('path');
var argv = require('../argv');

var assign = require('object-assign');

//解析配置文件的参数
try {
    var configPath = argv.c ? path.resolve(argv.c) : path.join(process.cwd(), 'ftl.config.js');
    var config = require(configPath);
    config.configPath = configPath;
} catch(error) {
    if (error.code === 'MODULE_NOT_FOUND') {
        console.error('can not find a config file, -c [config file] as command option or a file named ftl.config.js in CWD');
    } else {
        console.error('config parse error: ' + error.message);
    }
    module.exports = error;
    process.exit(1);
}

var log = (argv.log || '').split('+');
argv.log = {static: true, error: true};
log.forEach(function(l) {
    argv.log[l.replace('no-', '')] = false;
});
//返回命令行参数和配置文件参数
module.exports = assign({
    port: '8000'
}, config, argv);
