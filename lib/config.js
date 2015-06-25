var path = require('path');
var argv = require('./argv');
var assign = require('object-assign');

Object.assign || (Object.assign = assign);

// 解析配置文件的参数
try {
    var configPath = argv.c ? path.resolve(argv.c) : path.join(process.cwd(), 'ftl.config.js');
    var config = require(configPath);
    config.configPath = configPath;
} catch(error) {
    if (error.code === 'MODULE_NOT_FOUND' && error.message.indexOf(argv.c ? argv.c : 'ftl.config.js') > 0) {
        console.error('can not find the config file, -c <config file> as command option or a file named ftl.config.js in CWD');
    } else {
        console.error('config parse error: ' + error.message);
    }
    module.exports = error;
    process.exit(1);
}

// ftl目录
config.ftlBase = config.ftl.base || process.cwd();

// 静态目录
Array.isArray(config.public) || (config.public = [config.public]);

// livereload配置
config.hot && (argv.hot = true);

// log
config.log = config.log || [];
argv.log = argv.log || [];
if (config.log.length === 0 && argv.log.length === 0) {
    argv.log = ['all'];
} else {
    argv.log = config.log.concat(argv.log);
}

// 返回命令行参数和配置文件参数
module.exports = assign({
    port: '8000'
}, config, argv);
