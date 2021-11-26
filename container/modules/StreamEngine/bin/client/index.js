var uuid = require('uuid');

module.exports = class Client {

    constructor(props) {
        this.props = props
        this.channels = []
        this.clientId = uuid.v4();
        this.setState()
    }

    setState () {
        this.state = {
            status: 0,
            statusMessage: 'no connection',
            transports: {},
            producers: [],
            consumers: [],
        }
    }

    setStatusMessage (message) {
        this.state.statusMessage = message;
    }

    connect (channel) {
        if(!this.channels.includes(channel)) {
            this.channels.push(channel);
        }
    }
}