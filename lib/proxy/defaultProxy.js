var config = require('../config');
var defaultTarget = (config.https ? 'https' : 'http') + '://localhost:' + config.port;
module.exports = [{
    path: '/a/f/',
    target: defaultTarget
}, {
    path: '/m/f/',
    target: defaultTarget
}, {
    path: '/a/p/',
    target: defaultTarget
}];
