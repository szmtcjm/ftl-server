var supertest = require('supertest');
var expect = require('expect.js');
var app = require('../app')

var request = supertest(app);

describe('router', function () {

    describe('404', function () {

        it('get 404', function (done) {
            request.get('/404')
                .expect(404, done);
        });
    });

    describe('font', function () {
        it('res header should contain Access-Control-Allow-Origin when get font', function (done) {
            request.get('/font.woff')
                .expect('Access-Control-Allow-Origin', '*')
                .end(done);
        });
    });
});
