var uuid = require('uuid');

module.exports = class Connection {
    constructor (channel, client) {
        this.connectionId = uuid.v4();
        this.channel = channel;
        this.client = client;
        this.setState()
    }

    setState () {
        this.state = {
            status: 0,
            statusMessage: 'disconnected',
            connected: false,
            paused: false,
        }
    }
}