// const SessionStorage = require("../../package/framework/storage/session")
// const User = require("../Models/User");
module.exports = async (socket, next) => {
    // if( socket.conn.request?._query?.guards) {
    //     socket.$userSession = SessionStorage.fetch(await User.findById(socket.conn.request?._query?.guards))
    //     socket.$userSession.socket = socket
    // }
    
    next()
}