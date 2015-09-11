require('./slientLog.js');
var supertest = require('supertest');
var expect = require('expect.js');
var app = require('../app');

var request = supertest(app);

describe('ftl render test:', function() {
    it('get /', function(done) {
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
    });

    it('render a ftl for a function response', function(done) {
        request.get('/test1.ftl')
            .expect('Content-Type', 'text/html; charset=utf-8')
            .expect(/cjmtest1/, done);
    });

    it('render a ftl for a object response', function(done) {
        request.get('/test2.ftl')
            .expect('Content-Type', 'text/html; charset=utf-8')
            .expect(/cjmtest2/, done);
    });

    it('get a file not end with .ftl', function(done) {
        request.get('/file.js')
            .expect('file.js', done);
    });

});
