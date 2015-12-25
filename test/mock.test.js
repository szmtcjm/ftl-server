var supertest = require('supertest');
var expect = require('expect.js');
var app = require('../app');

var request = supertest(app);

describe('mock', function() {
    it('/mock/json', function(done) {
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

    it('/mock/function', function(done) {
        request.post('/mock/function')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end(function(err, res) {
                var json = JSON.parse(res.text);
                expect(json).to.eql({'response': 'function'});
                done(err);
            });
    });

    it('/mock/send', function(done) {
        request.post('/mock/send')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end(function(err, res) {
                var json = JSON.parse(res.text);
                expect(json).to.eql({'response': 'send'});
                done(err);
            });
    });

    it('/mock/jsonp', function(done) {
        request.get('/mock/jsonp')
            .query({jsonpCallback: 'call'})
            .expect('Content-Type', 'text/javascript; charset=utf-8')
            .end(function(err, res) {
                expect(res.text).to.be('\/**\/ typeof call === \'function\' && call({"response":"jsonp"});');
                done(err);
            });
    });

    it('/mock/delay', function(done) {
        var start = new Date();
        request.get('/mock/delay')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end(function(err, res) {
                var json = JSON.parse(res.text);
                expect(json).to.eql({'response': 'delay'});
                expect(new Date() - start).to.be.greaterThan(1000);
                done(err);
            });
    });

    it('/mock/jsonp/delay', function(done) {
        var start = new Date();
        request.get('/mock/jsonp/delay')
            .query({callback: 'call'})
            .expect('Content-Type', 'text/javascript; charset=utf-8')
            .end(function(err, res) {
                expect(res.text).to.be('\/**\/ typeof call === \'function\' && call({"response":"jsonp"});');
                expect(new Date() - start).to.be.greaterThan(1000);
                done(err);
            });
    });

    it('should success mock when given config path is a full href', function(done) {
        request.get('/mock/url')
            .type('text')
            .expect(200)
            .expect(function(res) {
                expect(res.text).to.be('success');
            })
            .end(done);
    });

    it('/mock/mockFile1', function(done) {
        request.get('/mock/mockFile1')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end(function(err, res) {
                var json = JSON.parse(res.text);
                expect(json).to.eql({test: 'mockFile1'});
                done(err);
            });
    });

    it('/mock/error/delay', function(done) {
        request.get('/mock/error/delay')
            .expect(500)
            .end(function(err, res) {
                expect(res.text).to.contain('mock.delay must a number');
                done();
            });
    });
    it('/mock/error/jsonp/delay', function(done) {
        request.get('/mock/error/jsonp/delay')
            .expect(500)
            .end(function(err, res) {
                expect(res.text).to.contain('mock.delay must a number');
                done();
            });
    });
});
