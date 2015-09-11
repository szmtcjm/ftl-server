module.exports = function(req, res, script) {
    var write = res.write;
    var end = res.end;
    var isHtml = false, hasReplace = false;
    res.write = function(chunk, encode) {
        var length = res.get('Content-length');
        var contentType = res.get('Content-Type');
        if (/\.(ftl|html|htm)$/.test(req.path)) {
            isHtml = true;
            if (Buffer.isBuffer(chunk)) {
                chunk = chunk.toString('utf-8');
            }
            if (chunk.indexOf('</head>') !== -1) {
                hasReplace = true;
                chunk = chunk.replace('</head>', script + '</head>');
                if (length) {
                    length = parseInt(length);
                    length += Buffer.byteLength(script);
                    !res.headersSent && res.set('Content-length', length);
                }
            }
            write.call(res, chunk, 'utf-8');
        } else {
            write.call(res, chunk, encode);
        }
    }
    res.end = function(chunk, encoding) {
        if (chunk != null) {
            this.write(chunk, encoding);
        }
        if (isHtml && !hasReplace) {
            // 主要是为了freemarker模板解析错误也能加上livereload
            this.write(script, 'utf-8');
        }
        return end.call(res);
    };
};
