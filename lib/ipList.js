var os = require('os');

function getIps() {
    var interfaces = os.networkInterfaces();
    var interName;
    var inter;
    var i;
    var result = [];
    for (interName in interfaces) {
        inter = interfaces[interName];
        for (i in inter) {
            if (inter[i].family === 'IPv4') {
                if (inter[i].address === '127.0.0.1') {
                    continue;
                }
                result.push(inter[i].address);
            }
        }
    }
    return result;
}

module.exports = getIps();
