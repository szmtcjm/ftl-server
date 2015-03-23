var path = require('path');
var argv = require('../argv');

var assign = require('object-assign');

//解析配置文件的参数
try {
    var configPath = path.resolve(argv.c);
    var config = require(configPath);
} catch(error) {
    if (error.code === 'MODULE_NOT_FOUND') {
        console.error('cannot find config file: ' + argv.c);
    } else {
        console.error('config parse error: ' + error.message);
    }
    module.exports = error;
    process.exit(1);
}

//返回命令行参数和配置文件参数
module.exports = assign({
    port: '8000'
}, config, argv);