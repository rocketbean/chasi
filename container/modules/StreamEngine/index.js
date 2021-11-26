
const mediasoup = require("mediasoup");
const Channel = require("./bin/channel");
const Client = require("./bin/client");
const starter = require("./bin/start");

module.exports = class StreamEngine {

    /**
     * CPU workers
     */
    static workers = [];

    /**
     * ASSIGNER
     * worker workload
     * spreads the load
     * for each CPU worker
     */
    static assigner = 0;

    /* * * * * * *
     * channels
     *-----------
     * Channel Container
     */
    static channels = {};

    /* * * * * * *
     * clients
     *-----------
     * Client Container
     */
    static clients = {};

    constructor($config) {
        this.config = $config
    }

    get channels () {
        return StreamEngine.channels
    }

    get clients () {
        return StreamEngine.clients
    }

    assignWorker () {
        const worker = StreamEngine.workers[StreamEngine.assigner];
        if (++StreamEngine.assigner === StreamEngine.workers.length) StreamEngine.assigner = 0;
        return worker;
    }

    async createChannel (props = {}) {
        let worker = this.assignWorker();
        let {router, audioLevelObserver} = await this.setParams(worker);
        let channel = new Channel(router, audioLevelObserver, props)
        await this.registerChannel(channel);
        return channel
    }

    async createClient (props = {}) {
        let client = new Client(props)
        await this.registerClient(client);
        return client;
    }
    
    async registerChannel (channel) {
        StreamEngine.channels[channel.channelId] = channel
    }

    async registerClient (client) {
        StreamEngine.clients[client.clientId] = client
    }

    async setParams (worker) {
        var { mediaCodecs } = this.config.mediasoup.router;
        var { audio } = this.config.mediasoup.observers;
        let router = await worker.createRouter({ mediaCodecs });
        let audioLevelObserver = await router.createAudioLevelObserver(audio);
        return {router, audioLevelObserver}
    }

    static async init ($config) {
       await starter(StreamEngine.workers, $config);
       return new StreamEngine($config);
    }
}

