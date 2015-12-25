module.exports = [{
    path: '/mock/mockFile1',
    method: 'get',
    status: '200',
    response: function(req, res) {
        return {
            test: 'mockFile1'
        }
    }
}, {
    path: '/mock/mockFile2',
    method: 'post',
    status: '200',
    response: function(req, res) {
        return {
            test: 'mockFile2'
        }
    }
}, {
    path: '/mock/error/delay',
    method: 'get',
    delay: 'a',
    response: 'result'
}]
