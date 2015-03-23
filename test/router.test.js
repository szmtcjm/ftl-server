var supertest = require('supertest');
var expect = require('expect.js');
var app = require('../app')

var request = supertest(app);

describe('router', function() {
    describe('redirect', function() {
        
        it('get /', function(done) {
            request.get('/')
                .expect(302)
                .expect('location', '/ftl/', done);
                
        });

        it('get /ftl', function(done) {
            request.get('/ftl')
                .expect(302)
                .expect('location', '/ftl/', done);
        });
    });
   
    describe('404', function() {

        it('get 404', function(done) {
            request.get('/404')
                .expect(404, done);
        });
    });
});