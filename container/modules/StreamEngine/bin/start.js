const mediasoup = require('mediasoup');

module.exports = async function (mediaWorkers, config) {
    const { workers } = config.mediasoup;
    if(config.logging) {
        log.full("Starting StreamEngine", "cool")
    }
    
    for (let i = 0; i < workers; ++i) {
        let worker = await mediasoup.createWorker({
            logLevel: config.mediasoup.worker.logLevel,
            logTags: config.mediasoup.worker.logTags,
            rtcMinPort: config.mediasoup.worker.rtcMinPort,
            rtcMaxPort: config.mediasoup.worker.rtcMaxPort,
        });
        worker.on('died', () => {
            console.error('mediasoup worker died (this should never happen)');
            process.exit(1);
        });
        mediaWorkers.push(worker)
    }
    return { mediaWorkers };
}
