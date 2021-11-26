var uuid = require('uuid');
var Connection = require("../connection");

module.exports = class Channel {
    
    constructor(router, audioLevelObserver, props) {
        this.channelId = uuid.v4();
        this.props = props;
        this.router = router;
        this.audioLevelObserver = audioLevelObserver;
        this.peers = {};
        this.connections = [];
        this.#setState();
    }

    get rtpCapabilities () {
        return this.router.rtpCapabilities;
    }

    #setState () {
        this.state = {
            status: 0,
            participants: [],
            activeSpeaker: { producerId: null, volume: null, peerId: null },
            transports: {},
            producers: [],
            consumers: [],
            options: {
              locked: false,
              activeStream: false,
              lockedTo: 0
            }
        }
    }

    async join (client) {
        this.peers[client.clientId] = client;
        client.connect(this.channelId);
        let con = new Connection(this, client);
        this.connections.push(con.connectionId);
        client.setStatusMessage(`joined to ${this.channelId}`);
        return con;
    }

}