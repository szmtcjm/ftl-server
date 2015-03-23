var path_join = require('path').join;

module.exports = {
    'public': path_join(__dirname, '..', 'public'),
    port: '80',
    ftl: {
        base: path_join(__dirname, '..', 'ftl'),
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
            url: '/mock/json',
            method: 'get',
            status: '200',
            header: {

            },
            response: {
                a: 1,
                b: 5
            }
        }, {
            url: '/mock/function',
            method: 'post',
            response: function(req, res) {
                return {
                    'response': 'function'
                }
            }

        }, {
            url: '/mock/send',
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
            url: '/mock/delay',
            method: 'get',
            delay: 1000,
            response: function(req, res) {
                res.send({
                    'response': 'delay'
                });
            }
        }

    ],
    proxy: {
        '/get': ''
    }
}