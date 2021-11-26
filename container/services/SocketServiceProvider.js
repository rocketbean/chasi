const OpenSocket = require("../../package/framework/chasi/OpenSocket")
const Provider = handle("/package/statics/Provider");

class SocketServiceProvider extends Provider{
    
    static async boot () {
        new OpenSocket({
            name: 'user',
            namespace: 'user.js',
            middlewares: []
        })
    }
}

module.exports = SocketServiceProvider