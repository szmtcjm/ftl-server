var argv = require('yargs')
    .usage('Usage: ftl-server -c config-file [option]')
    .example('ftl-server -c ./config.json -p 8000', 'start server with port 8000')
    .alias('c', 'config')
    .describe('c', 'the config file, it is not required if there is a file named ftl.config.js in your CMD')
    .help('h')
    .alias('h', 'help')
    .alias('p', 'port')
    .describe('p', 'the server listening port, default to 8000')
    .alias('l', 'log')
    .describe('l', '-l no-static, exclude static assets logs; -l no-static+no-error, exclude static assets log and error logs')
    .boolean('hot')
    .describe('hot', 'enable live reload')
    .argv;

module.exports = argv;