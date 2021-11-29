
const mediasoup = require("mediasoup");
const Container = require("./bin/container");

const Channel = require("./bin/channel");
const Client = require("./bin/client");
const Connection = require("./bin/connection");
const starter = require("./bin/start");

module.exports = class StreamEngine extends Container {

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

    constructor($config) {
        super();
        this.config = $config
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
       Container.config = $config; 
       return new StreamEngine($config);
    }
}

