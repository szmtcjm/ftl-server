module.exports = {
    base: 'E:\\20150228-origin-2\\20150228-origin-2\\fund-web\\src\\main\\webapp\\WEB-INF\\ftl',
    'public': 'E:\\20150228-origin-2\\20150228-origin-2\\apache',
    port: '80',
    ftl: {
        global: {
            
        },
        'productDetail_000008_new.ftl': function(req, res) {
            return {
                saleActivityMap: {
                "000008": {
                    activityStatus: 'actived'
                }
            }
            }
        }

    },
    mock: [
        {
            url: '/request',
            method: 'get',
            status: '200',
            delay: '',
            contentType: '',
            header: {

            },
            response: function(req, res) {
                res.send({
                    a:1,
                    b:2
                });
            }
        }
    ],
    proxy: {
        '/get': ''
    }
}