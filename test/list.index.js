var list = require('../lib/list');
var path = require('path');
var expect = require('expect.js');

describe('test/list.index.js', function() {
    it ('failed if get in a file, not a dir', function() {
        return list('./list.index.js').then(function() {
            throw Error('shoud be rejected but Fulfilled');
        }, function(err) {
            expect(err.code).to.be('ENOENT');
        });
    }); 

    it('dir will be dir/, file will be file', function() {
        return list(path.join(__dirname, 'fixtures/dir')).then(function(res) {
            expect(res).to.contain('dir/');
            expect(res).to.contain('file');
        }, function() {
            throw Error('shoud be Fulfilled but rejected');
        });
    });
});