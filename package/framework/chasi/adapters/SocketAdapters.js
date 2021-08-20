export default class SocketAdapters {
    static $io;
    static $sockets = [];

    static setIo ($io) {
        SocketAdapters.$io = $io
    }
}
