var https = require('https');
var fs = require("fs");
var path_join = require('path').join;
var options = {
    key: fs.readFileSync(path_join(__dirname, './privatekey.pem')),
    cert: fs.readFileSync(path_join(__dirname, './certificate.pem'))
};

var server;

exports.startForGET = function() {
    server = https.createServer(options, function(req, res) {
        res.end(req.url);
    }).listen(3000);
}

exports.startForPOST = function() {
    server = https.createServer(options, function(req, res) {
        req.pipe(res);
    }).listen(3000);
}

exports.stop = function() {
    server && server.close();
}