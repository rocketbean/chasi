const User = require("../../Models/User");
const SessionStorage = require("../../../package/framework/storage/session");
module.exports = async function (socket) {
    socket.on("initiate", async data => {
        let session = await SessionStorage.fetch(await User.findById(data._id));
        if(session) {
            session.initiateSocket(socket) 
            socket.alias = data.email
        };
    });
}