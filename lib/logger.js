var morgan = require('morgan');
var logConfig = require('./config').log;

logConfig.forEach(function(log) {
    logConfig[log] = true;
});

function skip(req, res) {
    req.log = req.log || {};

    if (logConfig.all) {
        return false;
    }

    if (logConfig.ftl && req.log.ftl) {
        return false;
    }
    if (logConfig.mock && req.log.mock) {
        return false;
    }

    if (logConfig.proxy && req.log.proxy) {
        return false
    }

    return true;
}

exports = module.exports = morgan('dev', {skip: skip});

exports.addLogType = function(req, type) {
    req.log =  req.log || {};
    req.log[type] = true;
}
