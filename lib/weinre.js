var opn = require('opn');
var assign = require('object-assign');
var path = require('path');
var child_process = require('child_process');
var colors = require('colors');
var config = require('./config.js');
var injectScript = require('./injectScript.js');
var injectScriptString;

module.exports = function() {
    if (!config.remoteDebug) {
        return function(req, res, next) {
            next();
        };
    }
    var weinreOpt = setWeinreOption();
    runWeinre(weinreOpt);
    setinjectScript(weinreOpt);
    try {
        if (config.remoteDebug.browser !== null) {
            opn('http://' + weinreOpt.boundHost + ':' + weinreOpt.httpPort + '/client/#ftl-server',
                { app: config.remoteDebug.browser || 'chrome' });
        }
    } catch (error) {
        console.log(colors.red('Can not open the browser:' + config.remoteDebug.browser || 'chrome'));
    }
    
    return weinreMiddleware;
};

function weinreMiddleware(req, res, next) {
    injectScript(req, res, injectScriptString);
    next();
};

function setWeinreOption() {
    var weinreOpt = {
        httpPort: 8081,
        verbose: false,
        debug: false,
        readTimeout: 5,
        deathTimeout: 15,
        boundHost: require('./ipList.js')[0]
    };
    if (typeof config.remoteDebug !== 'boolean') {
        weinreOpt = assign(weinreOpt, config.remoteDebug);
        console.log(weinreOpt);
    }
    return weinreOpt;
}

function runWeinre(weinreOpt) {
    var weinrepath = path.resolve(__dirname, '..', 'node_modules/weinre/weinre');
    child_process.spawn('node', [
        weinrepath,
        '--httpPort', weinreOpt.httpPort.toString(),
        '--boundHost', weinreOpt.boundHost
    ]);
}

function setinjectScript(weinreOpt) {
    if (config.https) {
        config.proxy  = config.proxy || [];
        var targetUrl = 'http://' + weinreOpt.boundHost + ':' + weinreOpt.httpPort;
        config.proxy.push({
            path: '/target/target-script-min.js',
            target: targetUrl + '/target/target-script-min.js#ftl-server'
        }, {
            path: '/ws/target',
            target: targetUrl + '/ws/target'
        });
        injectScriptString = '<script>+function(){ \
            var script = document.createElement("script"); \
            script.src = "https://" + location.host + "/target/target-script-min.js#ftl-server"; \
            var cur = document.getElementsByTagName("script")[0]; \
            cur.parentNode.insertBefore(script, cur); \
            }();</script>';
    } else {
        injectScriptString = '<script src="http://' + weinreOpt.boundHost + ':' +
            weinreOpt.httpPort + '/target/target-script-min.js#ftl-server"></script>';
    }
}
