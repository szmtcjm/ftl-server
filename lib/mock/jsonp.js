module.exports = function(mock) {
    return function(req, res, next) {
        var response = mock.response;

        res.status(mock.status || 200);
        res.set('Content-Type', mock.ContentType || 'application/javascript; charset=UTF-8');
        res.set(mock.header || {});
        req.app.set('jsonp callback name', mock.jsonp);

        if (typeof response === 'function') {
            response = response(req, res);
        }

        if (!res.headersSent && !mock.delay) {
            res.jsonp(response);
        }

        if (!res.headersSent && mock.delay) {
            if (Number.isNaN(Number(mock.delay))) {
                var err = new Error('config: mock.delay must a number');
                console.log(err);
                next(err)
                return;
            }
            process.nextTick(function() {
                res.jsonp(response);
            }, mock.delay);
        }
    }
}