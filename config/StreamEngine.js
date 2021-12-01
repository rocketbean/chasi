const os = require('os');
module.exports = {
    driver: 'mediasoup',
    logging: true,

    /**
    * HTTP configs
    * http server ip,
    * port, and peer timeout constant
    */ 
    httpIp: checkout(process.env.StreamEngineIp, 'local'),
    httpPort: checkout(process.env.StreamEngineIp, 'local'),
    httpPeerStale: 15000,
    
    /**
     * classifies the model
     * to represent as a single
     * entity
     */
    initiatorModel: 'users',

    /**
     * SSL Cert Options
     * will boot http instead
     * if certs are missing
     */
    sslCrt: checkout(process.env.StreamEngineSslCrt),
    sslKey: checkout(process.env.StreamEngineSslKey),

    /**
     * Mediasoup Configs
     */
    mediasoup: {

      /**
       * CPU thread 
       * worker assignment
       */
      workers: Object.keys(os.cpus()).length,
      worker: {
        rtcMinPort: checkout(process.env.StreamEngineMinPort),
        rtcMaxPort: checkout(process.env.StreamEngineMaxPort),
        logLevel: 'debug',
        logTags: [
          'info',
          'ice',
          'dtls',
          'rtp',
          'srtp',
          'rtcp',
          // 'rtx',
          // 'bwe',
          // 'score',
          // 'simulcast',
          // 'svc'
        ],
      }, 
      router: {
        mediaCodecs:
        [
          {
            kind      : 'audio',
            mimeType  : 'audio/opus',
            clockRate : 48000,
            channels  : 2
          },
          {
            kind       : 'video',
            mimeType   : 'video/VP8',
            clockRate  : 90000,
            parameters :
            {
              'x-google-start-bitrate' : 1000
            }
          },
          {
            kind       : 'video',
            mimeType   : 'video/VP9',
            clockRate  : 90000,
            parameters :
            {
              'profile-id'             : 2,
              'x-google-start-bitrate' : 1000
            }
          },
          {
            kind       : 'video',
            mimeType   : 'video/h264',
            clockRate  : 90000,
            parameters :
            {
              'packetization-mode'      : 1,
              'profile-level-id'        : '4d0032',
              'level-asymmetry-allowed' : 1,
              'x-google-start-bitrate'  : 1000
            }
          },
          {
            kind       : 'video',
            mimeType   : 'video/h264',
            clockRate  : 90000,
            parameters :
            {
              'packetization-mode'      : 1,
              'profile-level-id'        : '42e01f',
              'level-asymmetry-allowed' : 1,
              'x-google-start-bitrate'  : 1000
            }
          }
        ]
      },
      observers: {
        audio: {
            maxEntries : 100,
            threshold  : -80,
            interval   : 2000 //800
        }
      },
      /**
       * Transport Options
       * rtp listenIps are the most important thing, below. you'll need
       * to set these appropriately for your network.
       */
      webRtcTransport: {
        listenIps: [

          { ip: '0.0.0.0', announcedIp: '192.168.254.119' },
          { ip: '127.0.0.1', announcedIp: null },
        ],
        enableUdp: true,
        enableSctp: true,
        enableTcp: true,
        sctpCapabilities : {
          port: 5000,
          /**
           * Initially requested number of outgoing SCTP streams.
           */
          OS: 100,
          /**
           * Maximum number of incoming SCTP streams.
           */
          MIS: 24275,
          /**
           * Maximum allowed size for SCTP messages.
           */
          maxMessageSize: 24275,
        },
        initialAvailableOutgoingBitrate: 1000000,
      }
    }

  };
