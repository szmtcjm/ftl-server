var argv = require('yargs')
    .usage('Usage: ftl-server -c config-file [option]')
    .example('ftl-server ./config.json -p 8000', 'start server with port 8000')
    .demand('c')
    .alias('c', 'config')
    .describe('c', 'the required config file')
    .help('h')
    .alias('h', 'help')
    .describe('p', 'the server listening port, default to 8000')
    .alias('p', 'port')
    .argv;

var fs = require('fs');
var assign = require('object-assign');
var configString = fs.readFileSync(argv.c, {encoding: 'utf-8'});

//解析配置文件的参数
try {
    var config = JSON.parse(configString);
} catch(error) {
    console.error('config parse error: ' + error.message);
    process.exit(1);
}

//返回命令行参数和配置文件参数
module.exports = assign({
    port: '8000'
}, config, argv);