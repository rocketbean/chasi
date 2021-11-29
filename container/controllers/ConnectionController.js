
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
}

module.exports = new ConnectionController()