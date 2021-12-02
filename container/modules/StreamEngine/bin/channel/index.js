var uuid = require('uuid');
var Connection = require("../connection");
const Peer = require('./peer');

module.exports = class Channel {
    #peers;
    #consumers;
    #router;
    #clients;

    constructor(router, audioLevelObserver, props) {
        this.channelId = uuid.v4();
        this.props = props;
        this.#router = router;
        this.audioLevelObserver = audioLevelObserver;
        this.#clients = {};
        this.#peers = new Map();
        this.#consumers = {};
        this.connections = [];
        this.#setState();
    }

    get peers () {
        let peerObject = {};
        this.#peers.forEach((v, k) => {
            peerObject[k] = v
        });
        return peerObject;
    }

    get clients () {
        return this.#clients;
    }

    set clients (value) {
        this.#clients = value;
    }

    get router () {
        return this.#router;
    }

    get rtpCapabilities () {
        return this.router.rtpCapabilities;
    }

    #setState () {
        this.state = {
            status: 0,
            participants: [],
            activeSpeaker: { producerId: null, volume: null, peerId: null },
            options: {
              locked: false,
              activeStream: false,
              lockedTo: 0
            }
        }
    }

    async join (client) {
        try {
            this.clients[client.clientId] = client;
            client.connect(this.channelId);
            let con = new Connection(this, client);
            this.connections.push(con.connectionId);
            client.setStatusMessage(`joined to ${this.channelId}`);
            return con;
        } catch(e) {
            console.log(e)
        }
    }

    async createPeer (client, producer) {
        if(!this.#peers.has(client.clientId)) this.#peers.set(client.clientId, new Peer(client))
        let peer = this.#peers.get(client.clientId)
        await peer.addProducer(producer);
    }

    async createRouterTransport(options) {
        return  await this.router.createWebRtcTransport(options);
    }

}