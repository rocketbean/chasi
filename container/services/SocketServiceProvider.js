const OpenSocket = require("../../package/framework/chasi/OpenSocket")

class SocketServiceProvider {
    
    static boot () {
        new OpenSocket({
            name: 'user',
            namespace: 'user.js',
            middlewares: []
        })
    }
}

module.exports = SocketServiceProvider