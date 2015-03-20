//暂时无用
var _callbacks = [];
var dispatcher = {

    register: function(callback) {
        _callbacks.push(callback);
        return _callbacks.length - 1; // index
    },

    dispatch: function(payload) {
        _callbacks.forEach(function(i, callback) {
            callback(payload);
        });
    }
};

module.exports = dispatcher;