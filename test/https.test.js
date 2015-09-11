require('./slientLog.js');
var supertest = require('supertest');
var expect = require('expect.js');
var httpApp = require('./support/http.js');
var httpsApp = require('./support/https.js');



describe('https', function() {
    var oldApp;
    var newApp;
    var request;
    before(function() {
        oldApp = require('../app');
        require.cache[require.resolve('../app')] = undefined;

        var config = require('../lib/config');
        config.https = true;
        config.port = 8001;
        config.remoteDebug = {
            httpPort: 10000
        };
        newApp = require('../app');
        request = supertest(newApp);
    });
    after(function() {
        require.cache[require.resolve('../app')] = oldApp;
        newApp.server.close();
    });
    describe('ftl', function() {
        it('should successfully render ftl file', function(done) {
            request.get('/')
                .expect(200)
                .expect('Content-Type', 'text/html; charset=utf-8')
                .end(function(err, res) {
                    expect(res.text).to.contain('folder/');
                    expect(res.text).to.contain('test1.ftl');
                    expect(res.text).to.contain('test2.ftl');
                    expect(res.text).to.contain('file.js');
                    done(err);
                });
        })
    });

    describe('mock', function() {
        it('should successfully mock request', function(done) {
            request.get('/mock/json')
                .expect('Content-Type', 'application/json; charset=utf-8')
                .end(function(err, res) {
                    var json = JSON.parse(res.text);
                    expect(json).to.eql({
                        a: 1,
                        b: 5
                    });
                    done(err);
                });
        });
    });

    describe('proxy:https->http', function() {
        before(function() {
            httpApp.startForGET();
        });

        after(function() {
            httpApp.stop();
        });

        it('response should be / when get /proxy1', function(done) {
            request.get('/proxy1')
                .expect(200)
                .end(function(err, res) {
                    expect(res.text).to.be('/');
                    done(err);
                });
        });
    });

    describe('proxy:https->https', function() {
        before(function() {
            httpsApp.startForGET();
        });

        after(function() {
            httpsApp.stop();
        });

        it('response shoud be "/m/w?a=1" when get /proxy5/w?a=1', function(done) {
            request.get('/proxy5/w?a=1')
                .expect(200)
                .end(function(err, res) {
                    expect(res.text).to.be('/m/w?a=1');
                    done(err);
                });
        });
    });
});
