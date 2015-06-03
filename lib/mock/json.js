module.exports = function(mock) {
    return function(req, res, next) {
        var response = mock.response;

        res.status(mock.status || 200);
        mock.ContentType && res.set('Content-Type', mock.ContentType);
        res.set(mock.header || {});
        
        if (typeof response === 'function') {
            response = response(req, res);
        }

        if (!res.headersSent && !mock.delay) {
            res.send(response);
        }

        if (!res.headersSent && mock.delay) {
            if (isNaN(Number(mock.delay))) {
                var err = new Error('config: mock.delay must a number');
                console.log(err);
                next(err)
                return;
            }
            setTimeout(function() {
                res.send(response);
            }, mock.delay);
        }
    }
}