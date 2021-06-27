const socketio = require("socket.io")


class ServerWrap {
    static _g;
    static property;
    static $app;
    constructor () {
        this.property = ServerWrap.property.app;
        this.server = null;
        this.loadProtocol();
    }

    loadProtocol() {
        if(this.property.cert.protocol === 'https')
            this.protocol = ServerWrap._g.https;
        else
            this.protocol = ServerWrap._g.http;
    }

    install () {
        if(this.property.cert.protocol === 'https') {
            this.server = this.protocol.createServer({
                key: this.getFileSync(this.property.cert.key), 
                cert: this.getFileSync(this.property.cert.cert)
            }, ServerWrap.$app);
        } else {
            this.server = this.protocol.createServer({}, ServerWrap.$app);
        }
        return this.server;
    }


    getFileSync (path) {
        return ServerWrap._g.fs.readFileSync(path)
    }
    
    static initialize (_g, property, $app) {
        ServerWrap._g = _g;
        ServerWrap.property = property;
        ServerWrap.$app = $app;
    }
}

module.exports = ServerWrap;