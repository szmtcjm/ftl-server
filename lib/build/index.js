var resolve = require('path').resolve;
var webpack = require('webpack');
var webpackDevMiddleware = require('webpack-dev-middleware');
var router = require('express').Router();
var SPMWebpackPlugin = require('./SPMWebpackPlugin');
var buildConfig = require('../config').build;

function getCompiler(entry, outputPath, base) {
    return webpack({
        entry: entry,
        output: {
            path: outputPath,
            filename: 'product-fund.js'
        },
        module: {
            loaders: [
                { test: /\.css$/, loader: "style!css" }
            ]
        },
        plugins: [new SPMWebpackPlugin(base)],
        devtool: 'inline-source-map',
        debug: true
        // stats: {
        //     colors: true
        // }
    });
}

function emptyMiddleware(req, res, next) {
    return next();
}

module.exports = function() {
    if (!buildConfig) {
        return emptyMiddleware;
    }
    var jsBuildConfig = buildConfig.js || [];
    var base = buildConfig.base || '';
    jsBuildConfig.forEach(function(item) {
        var entry = resolve(base, item[0]);
        var outputPath = resolve(base, item[1]);
        router.use(webpackDevMiddleware(getCompiler(entry, outputPath, base), {
            noInfo: false,
            filename: 'product-fund.js',
            publicPath: '/public/',
            stats: {
                colors: true
            }
        }));
    });

    return router;
};
