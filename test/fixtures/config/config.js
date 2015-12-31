var path_join = require('path').join;

exports = module.exports = {
    public: path_join(__dirname, '..', 'public'),
    port: '8000',
    hot: true,
    log: ['none'],
    remoteDebug: {
        httpPort: 8089,
        browser: null
    },
    ftl: {
        base: path_join(__dirname, '..', 'ftl'),
        dataFiles: [path_join(__dirname, '..', 'ftl', 'ftlDataFile1.ftl')],
        global: {
            'global': 'cjm'
        },
        'test1.ftl': function(req, res) {
            return {
                'test1': 'test1'
            }
        },
        'test2.ftl': {
            test2: 'test2'
        }
    },
    mock: [{
            path: '/mock/json',
            method: 'get',
            status: '200',
            header: {

            },
            response: {
                a: 1,
                b: 5
            }
        }, {
            path: '/mock/function',
            method: 'post',
            response: function(req, res) {
                return {
                    'response': 'function'
                }
            }

        }, {
            path: '/mock/send',
            method: 'post',
            response: function(req, res) {
                res.send({
                    'response': 'send'
                });
            }
        }, {
            url: '/mock/jsonp',
            method: 'get',
            jsonp: 'jsonpCallback',
            response: function(req, res) {
                return {
                    'response': 'jsonp'
                };
            }
        }, {
            path: '/mock/delay',
            method: 'get',
            delay: 1000,
            response: function(req, res) {
                return {
                    'response': 'delay'
                }
            }
        }, {
            path: '/mock/jsonp/delay',
            method: 'get',
            jsonp: true,
            delay: 1000,
            response: function(req, res) {
                return {
                    'response': 'jsonp'
                };
            }
        }, {
            path: 'https://baidu.com/mock/url?a=1',
            response: 'success'
        }, path_join(__dirname, '..', 'mock', 'mock1.js'), path_join(__dirname, '..', 'mock', 'mock2.js')],
        projects:{
            diana:[
                ['',''],
                ""
            ],
            athena:[
                [''],
                ""
            ],
            ares:[
                [''],
                ""
            ]
        }
}

exports.proxy = [];
exports.proxy.push({
    path: '/proxy1',
    target: 'http://localhost:3000'
})

exports.proxy.push({
    path: '/proxy2/',
    target: 'http://localhost:3000/'
})

exports.proxy.push({
    path: '/proxy3',
    target: 'http://localhost:3000/m'
})

exports.proxy.push({
    path: '/proxy4/',
    target: 'http://localhost:3000/m/'
})

exports.proxy.push({
    path: '/proxy5',
    target: 'https://localhost:3000/m'
})

exports.proxy.push({
    path: '/proxy6',
    target: 'http://localhost:3000/'
})
