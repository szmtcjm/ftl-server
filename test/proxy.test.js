var supertest = require('supertest');
var expect = require('expect.js');
var app = require('../app');

var request = supertest(app);
var httpApp = require('./support/http.js');
var httpsApp = require('./support/https.js');
var redirect = require('./support/redirect.js');

describe('proxy test', function() {
    describe('proxy test:http-GET', function() {
        
        before(function() {
            httpApp.startForGET();
        });

        after(function() {
            httpApp.stop();
        });

        it('GET /proxy1, /proxy1 - .com', function(done) {
            request.get('/proxy1')
                .expect(200)
                .end(function(err, res) {
                    expect(res.text).to.be('/');
                    done(err);
                });
        });

        it('GET /proxy1/, /proxy1 - .com', function(done) {
            request.get('/proxy1/')
                .expect(200)
                .end(function(err, res) {
                    expect(res.text).to.be('/');
                    done(err);
                });
        });

        it('GET /proxy1/w?a=1, /proxy1 - .com', function(done) {
            request.get('/proxy1/w?a=1')
                .expect(200)
                .end(function(err, res) {
                    expect(res.text).to.be('/w?a=1');
                    done(err);
                });
        });

        it('GET /proxy2, /proxy2/ - .com/', function(done) {
            request.get('/proxy2')
                .expect(200)
                .end(function(err, res) {
                    expect(res.text).to.be('/');
                    done(err);
                });
        });

        it('GET /proxy2/, /proxy2/ - .com/', function(done) {
            request.get('/proxy2/')
                .expect(200)
                .end(function(err, res) {
                    expect(res.text).to.be('/');
                    done(err);
                });
        });

        it('GET /proxy2/w?a=1, /proxy2/ - .com/', function(done) {
            request.get('/proxy2/w?a=1')
                .expect(200)
                .end(function(err, res) {
                    expect(res.text).to.be('/w?a=1');
                    done(err);
                });
        });

        it('GET /proxy3, /proxy3 - .com/m', function(done) {
            request.get('/proxy3')
                .expect(200)
                .end(function(err, res) {
                    expect(res.text).to.be('/m');
                    done(err);
                });
        });

        it('GET /proxy3/, /proxy3 - .com/m', function(done) {
            request.get('/proxy3/')
                .expect(200)
                .end(function(err, res) {
                    expect(res.text).to.be('/m/');
                    done(err);
                });
        });

        it('GET /proxy3/w?a=1, /proxy3 - .com/m', function(done) {
            request.get('/proxy3/w?a=1')
                .expect(200)
                .end(function(err, res) {
                    expect(res.text).to.be('/m/w?a=1');
                    done(err);
                });
        });

        it('GET /proxy4, /proxy4/ - .com/m/', function(done) {
            request.get('/proxy4')
                .expect(200)
                .end(function(err, res) {
                    expect(res.text).to.be('/m/');
                    done(err);
                });
        });

        it('GET /proxy4/, /proxy4/ - .com/m/', function(done) {
            request.get('/proxy4/')
                .expect(200)
                .end(function(err, res) {
                    expect(res.text).to.be('/m/');
                    done(err);
                });
        });

        it('GET /proxy4/w?a=1, /proxy4/ - .com/m/', function(done) {
            request.get('/proxy4/w?a=1')
                .expect(200)
                .end(function(err, res) {
                    expect(res.text).to.be('/m/w?a=1');
                    done(err);
                });
        });

    });

    describe('proxy test:http-POST', function() {
        before(function() {
            httpApp.startForPOST();
        });

        after(function() {
            httpApp.stop();
        });

        it('POST /proxy1, /proxy1 - .com', function(done) {
            request.post('/proxy1')
                .send('a=1&b=2')
                .expect(200)
                .end(function(err, res) {
                    expect(res.text).to.be('a=1&b=2');
                    done(err);
                });
        });
    });


    describe('proxy test:https--GET', function() {
        before(function() {
            httpsApp.startForGET();
        });

        after(function() {
            httpsApp.stop();
        });

        it('GET /proxy5/w?a=1, /proxy5 - .com/m', function(done) {
            request.get('/proxy5/w?a=1')
                .expect(200)
                .end(function(err, res) {
                    expect(res.text).to.be('/m/w?a=1');
                    done(err);
                });
        });
    });

    describe('proxy test:https--POST', function() {
        before(function() {
            httpsApp.startForPOST();
        });

        after(function() {
            httpsApp.stop();
        });

        it('POST /proxy5, /proxy5 - .com', function(done) {
            request.post('/proxy5')
                .send('a=1&b=2')
                .expect(200)
                .end(function(err, res) {
                    expect(res.text).to.be('a=1&b=2');
                    done(err);
                });
        });
    });

    describe('redirect', function() {
        before(function() {
            redirect.start();
        });
        after(function() {
            redirect.stop();
        });

        it('reponse text shoud be redirect', function(done) {
            request.get('/proxy6')
                .expect(200)
                .end(function(err, res) {
                    expect(res.text).to.be('redirect');
                    done(err);
                });
        });
    });
});