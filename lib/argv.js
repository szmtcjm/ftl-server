var argv = require('yargs')
    .usage('Usage: fs [option]')
    .example('fs -c ./config.json -p 8000', 'start server with port 8000')
    .alias('c', 'config')
    .describe('c', 'the config file, it is not required if there is a file named ftl.config.js in your CMD')
    .help('h')
    .alias('h', 'help')
    .alias('p', 'port')
    .describe('p', 'the server listening port, default to 8000')
    .alias('l', 'log')
    .array('l')
    .describe('l', '-l all mock proxy error, specify logger you wang to show. you can specify multiple separate by space. for example: -l mock proxy, will show mock and proxy logger; -l all is the default')
    .boolean('hot')
    .describe('hot', 'enable live reload')
    .alias('v', 'version')
    .boolean('https')
    .describe('https', 'use https')
    .version(function() {
        return require('../package').version;
    })
    .argv;

module.exports = argv;
