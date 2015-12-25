var path = require('path');
var argv = require('./argv');
var assign = require('object-assign');
var colors = require('colors');
var isArray = Array.isArray;

Object.assign || (Object.assign = assign);

function logError(message, filePath, detail) {
    message && console.log(colors.red.bold('\n' + message));
    filePath && console.log(colors.red.bold('    ' + filePath));
    detail && console.log(colors.red('\n' + detail));
    process.exit(1);
}

function readConfigFile() {
    // 解析配置文件的参数
    try {
        var configPath = argv.c ? path.resolve(argv.c) : path.join(process.cwd(), 'ftl.config.js');
        var config = require(configPath);
        config.configPath = configPath;
    } catch(error) {
        if (error.code === 'MODULE_NOT_FOUND' && error.message.indexOf(argv.c ? argv.c : 'ftl.config.js') > 0) {
            logError('Can not find the config file, \
                set -c <config file> as command option or \
                provide a file named ftl.config.js in CWD');
        } else {
            logError('Config file error:', configPath, error.stack);
        }
    }
    return config;
}

function parseFtlConfig(config) {
    if (!config.ftl || !config.ftl.base) {
        logError('Config field "config.ftl.base" is required!');
    }
    // ftl目录
    config.ftlBase = config.ftl.base || process.cwd();

    if (isArray(config.ftl.dataFiles)) {
        config.ftl = config.ftl.dataFiles.reduce(function(pre, curr) {
            try {
                return assign(pre, require(curr));
            } catch (e) {
                logError('Freemarker data error at file:', curr, e.name + ': ' + e.message);
            }
        }, config.ftl);
    }

    return config;
}

function parseMockConfig(config) {
    var mocks = [];
    config.mock.forEach(function(mockItem) {
        var fileMocks;
        if (typeof mockItem === 'string') {
            try {
                fileMocks = require(mockItem);
            } catch (e) {
                logError('Mock error at file:', mockItem, e.name + ': ' + e.message);
            }
            try {
                mockCheck(fileMocks);
            } catch (e) {
                logError('Mock config error at file:', mockItem, e.message);
            }
            mocks = mocks.concat(require(mockItem));
        } else {
            try {
                mockCheck(mockItem);
            } catch (e) {
                logError('Mock config error at file:', config.configPath, e.message);
            }
            mocks.push(mockItem);
        }
    });
    config.mock = mocks;
    return config;
}

function mockCheck(mocks) {
    if (!isArray(mocks)) mocks = [mocks];
    mocks.forEach(function(mockItem) {
        if ((typeof mockItem.path !== 'string' && typeof mockItem.url !== 'string') || !mockItem.response) {
            throw new Error('mock.path/mock.url and mock.response is required!\nThe current config is:\n' + JSON.stringify(mockItem));
        }
    });
}

function parsePublicConfig(config) {
    // 静态目录
    isArray(config.public) || (config.public = [config.public]);
    return config;
}

function parseBooleanConfig(field, config, argv) {
    if (config[field]) {
        argv[field] = true;
    }
}

function parseLogConfig(config, argv) {
    // log
    config.log = config.log || [];
    argv.log = argv.log || [];
    if (config.log.length === 0 && argv.log.length === 0) {
        argv.log = ['all'];
    } else {
        argv.log = config.log.concat(argv.log);
    }
}

function parseConfigHttps(config, argv) {
    if (config.https) {
        argv.https = true;
        argv.port = argv.port || config.port || 443;
    }
}

function parseConfig() {
    var config = readConfigFile();
    parseFtlConfig(config);
    parseMockConfig(config);
    parsePublicConfig(config);
    parseBooleanConfig('hot', config, argv);
    parseConfigHttps(config, argv);
    parseLogConfig(config, argv);
    return config;
}


// 返回命令行参数和配置文件参数
module.exports = assign({
    port: '80'
}, parseConfig(), argv);
