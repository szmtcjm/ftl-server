var path = require('path');
var configPath = path.join(__dirname, '..', 'fixtures', 'config', 'config.js');
process.argv = process.argv.concat(['-c', configPath, '-p', '8000']);
