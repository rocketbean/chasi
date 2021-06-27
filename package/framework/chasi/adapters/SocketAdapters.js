class SocketAdapters {
    static $io;
    static $sockets = [];

    static setIo ($io) {
        SocketAdapters.$io = $io
    }
}

module.exports = SocketAdapters;