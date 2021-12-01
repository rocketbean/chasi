
const Controller = handle("/package/statics/Controller");

class ConnectionController extends Controller {

  get engine () {
    return this.services.StreamEngine;
  }
  /**
   * Write a New ModelEntry
   * @param {request} [ExpressRequest] Object
   * @return {} translated as [ExpressResponse] Object
   * */
   async connect(request, response) {
    try {
      let {transportId, dtlsParameters} = request.body
      let connection = this.engine.connections[request.params.connection];
      let transport = connection.transports[transportId]
      await transport.connect({ dtlsParameters });
      return { connected: true };
    } catch(e) {
      console.log(e)
    }
  }

  /**
   * Single ObjectModel[index]
   * @param {request} [ExpressRequest] Object
   * @return {Object} translated as [ExpressResponse] Object
   * */
   async transport(request, response) {
    try {
      let connection = this.engine.connections[request.params.connection];
      let transport = await connection.createTransport(request.body.direction)
      return transport;
    } catch(e) {
      console.log(e)
    }
  }

  /**
   * handles track stream attachment
   * @param {request} [ExpressRequest] Object
   * @return {Object} translated as [ExpressResponse] Object
   * */
   async send(request, response) {
    try {
      let { transportId, kind, rtpParameters, paused=false, appData } = request.body;
      let connection = this.engine.connections[request.params.connection];
      let transport = connection.transports[transportId]
      await connection.publish(transport, {kind, rtpParameters, paused, appData})
    } catch(e) {
      console.log(e)
    }
  }

  /**
   * request for recieving streams
   * @param {request} [ExpressRequest] Object
   * @return {Object} translated as [ExpressResponse] Object
   * */
   async recv(request, response) {
    try {
      let { transportId, peer, rtpCapabilities } = request.body;
      let connection = this.engine.connections[request.params.connection];
      let transport = connection.transports[transportId];
      let producer = connection.channel.producers[peer];
      let consumer =  await transport.consume({
        producerId: producer.id,
        rtpCapabilities,
        paused: true, 
        appData: {}
      })
      return {
        producerId: producer.id,
        id: consumer.id,
        kind: consumer.kind,
        rtpParameters: consumer.rtpParameters,
        type: consumer.type,
        producerPaused: consumer.producerPaused
      }
    } catch(e) {
      console.log(e)
    }
  }

  /**
   * request for recieving peers
   * @param {request} [ExpressRequest] Object
   * @return {Object} translated as [ExpressResponse] Object
   * */
   async peers(request, response) {
    try {
      let connection = this.engine.connections[request.params.connection];
      return connection.channel.producers
    } catch(e) {
      console.log(e)
    }
  }
}

module.exports = new ConnectionController()