var logger = require('../lib/logger.js');
logger.logger = function(req, res, next) {
    next();
}
