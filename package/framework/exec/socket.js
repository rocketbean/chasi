class SocketWrapper {
    static property;
    static _g;
    static $server;
    static $app;

    constructor () {
        this.$io = SocketWrapper._g.socketio(SocketWrapper.$server)
    }

    static init(property, _g, server, app) {
        SocketWrapper.property = property;
        SocketWrapper._g = _g;
        SocketWrapper.$server = server;
        SocketWrapper.$app = app;
        if(SocketWrapper.property.server.enableSocketServer) return new SocketWrapper();
        else return false;
    }
}

module.exports = SocketWrapper;