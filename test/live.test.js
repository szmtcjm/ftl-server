var supertest = require('supertest');
var expect = require('expect.js');
var app = require('../app');
var WebSocket = require('ws');
var fs = require('fs');
var join = require('path').join;

var request = supertest(app);

describe('livereload', function() {
	it('should response live-client.js when get /ftl-server/live-client.js', function(done) {
		request.get('/ftl-server/live-client.js')
			.expect(200)
			.expect('Content-Type', 'application/javascript')
			.end(done);
	});

	it('html response should contain client script tag', function(done) {
		function containClientScript(res) {
			expect(res.text).to.contain('<script async defer src="/ftl-server/live-client.js"></script>');
		}
		request.get('/test4.ftl')
			.expect(containClientScript)
			.end(done);
	});

	it('should receive message when ftl change', function(done) {
		var ws = new WebSocket('ws://localhost:8000');
		ws.on('message', function(data) {
			expect(data).to.match(/change.ftl$/);
			ws.close();
			fs.writeFileSync(join(__dirname, 'fixtures', 'ftl', 'change.ftl'), '');
			done();
		});
		ws.on('open', function() {
			fs.writeFileSync(join(__dirname, 'fixtures', 'ftl', 'change.ftl'), 'c');
		});
	});

	it('should receive message when js/css... change', function(done) {
		var ws = new WebSocket('ws://localhost:8000');
		ws.on('message', function(data) {
			expect(data).to.match(/change.css$/);
			ws.close();
			fs.writeFileSync(join(__dirname, 'fixtures', 'public', 'change.css'), '');
			done();
		});
		ws.on('open', function() {
			fs.writeFileSync(join(__dirname, 'fixtures', 'public', 'change.css'), 'c');
		});
	});
});
