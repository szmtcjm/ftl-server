require('./slientLog.js');
var supertest = require('supertest');
var expect = require('expect.js');
var app = require('../app');

var request = supertest(app);

describe('remote debug', function() {
	it('should response target-script-min.js when get target-script-min.js', function(done) {
		var ip = require('../lib/ipList.js')[0];
		supertest('http://' + ip + ':8081')
			.get('/target/target-script-min.js')
			.expect(200, done)
	});

	// it('html response should contain weinre debug script tag', function(done) {
	// 	function containClientScript(res) {
	// 		expect(res.text).to.contain('/target/target-script-min.js#ftl-server"></script>');
	// 	}
	// 	request.get('/test4.ftl')
	// 		.expect(containClientScript)
	// 		.end(done);
	// });
});
