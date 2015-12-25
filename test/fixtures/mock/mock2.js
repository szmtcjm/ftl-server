module.exports = [{
    path: '/mock/mockFile3',
    method: 'get',
    status: '200',
    response: function(req, res) {
        return {
            test: 'mockFile3'
        }
    }
}, {
    path: '/mock/error/jsonp/delay',
    method: 'get',
    delay: 'tt',
    response: {
        test: 'jsonpdelay'
    }
}]
