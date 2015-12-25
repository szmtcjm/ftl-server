var config = require('../config');
var protocol = (config.https ? 'http' : 'https') + '://localhost:' + config.port;

module.exports = [{
    path: '/a/f/',
    target: protocol
}, {
    path: '/m/f/',
    target: protocol
}, {
    path: '/a/p/',
    target: protocol
}]
