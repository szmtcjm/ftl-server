var config = require('../lib/config');
var expect = require('expect.js');

// describe.skip('test error', function() {
//     describe('port 80', function() {
//         var port = config.port;
//         before(function() {
//             config.port = 80;
//         });
//         after(function() {
//             config.port = port;
//         })
//         it('80', function(done) {
//             process.on('exit', function(code) {
//                 expect(code).to.be(1);
//                 done();
//             });
//             require('../app.js');
//         });
//     });
// });
