var uuid = require('uuid');
var Container = require("./container");

module.exports = class Connection extends Container{

    /**
    * valid transport 
    * direction values;
    */
    static TransportDirection = ['send', 'recieve'];

    constructor (channel, client) {
        super();
        this.connectionId = uuid.v4();
        this.channel = channel;
        this.client = client;
        this.transports = {};
        this.dataProducer = {};
        this.setState()
        Connection.registerConnection(this)
    }

    setState () {
        this.state = {
            status: 0,
            statusMessage: 'disconnected',
            connected: false,
            paused: false,
        }
    }


    async createTransport (direction) {
        if(!(Connection.TransportDirection.includes(direction)))
            throw new Error(`unsupported transport direction:: [${direction}]`);
        let {
            listenIps,
            initialAvailableOutgoingBitrate
          } = Container.config.mediasoup.webRtcTransport;

        let transport = await this.channel.createRouterTransport({
                initialAvailableOutgoingBitrate,
                listenIps,
                enableUdp: true,
                enableTcp: false,
                enableSctp: true,
                preferUdp: true,
                numSctpStreams: {
                    OS: 1024,
                    /**
                     * Maximum number of incoming SCTP streams.
                     */
                    MIS: 1024,
                    /**
                     * Maximum allowed size for SCTP messages.
                     */
                    maxMessageSize: 24275
                },
                maxSctpMessageSize: 262144,
                appData: {
                    clientDirection: direction,
                }
        })
        console.log(transport)
        this.transportEvents(transport);
        this.transports[transport.id] = transport
        return this.destructureTransport(transport, this.dataProducer);
    }
    
    destructureTransport (transport) {
        let { id, iceParameters, iceCandidates, dtlsParameters } = transport;
        return {transportOptions: { id, iceParameters, iceCandidates, dtlsParameters }}
    }

    /**
     * @param {WebRtcTransport} transport
     * transport Objects
     * event instruction registration
     */
    
    async transportEvents(transport) {
        transport.observer.on("close", () => {
            console.log(`transport closed`);
        });
        transport.on("icestatechange", (state) => {
            console.log(`transport event: ${state.toString()}`);
        });
        transport.on("dtlsstatechange", async state =>  {
            console.log(`transport event: ${state.toString()}`);
        });
      }

}