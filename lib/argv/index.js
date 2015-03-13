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

module.exports = argv;