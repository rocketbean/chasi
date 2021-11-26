
const Controller = handle("/package/statics/Controller");

class ChannelController extends Controller {

  get engine () {
    return this.services.StreamEngine;
  }

  /**
   * Write a New ModelEntry
   * @param {request} [ExpressRequest] Object
   * @return {} translated as [ExpressResponse] Object
   * */
  async join(request, response) {
    try {
      let channel = this.engine.channels[request.params.channel];
      let client = this.engine.clients[request.params.client]
      return await channel.join(client)
    } catch(e) {
      console.log(e)
    }
  }

  /**
   * Single ObjectModel[index]
   * @param {request} [ExpressRequest] Object
   * @return {Object} translated as [ExpressResponse] Object
   * */
  async getRtpCapability(request, response) {
    try {
      let channel = this.engine.channels[request.params.channel];
      let {rtpCapabilities} = channel
      return rtpCapabilities
    } catch(e) {
      console.log(e)
    }

  }

  /**
   * List of ObjectModel[]
   * @param {request} [ExpressRequest] Object
   * @return {Array} translated as [ExpressResponse] Object
   * */
  async list(request, response) {
    
    
  }

  /**
   * Delete an ObjectModel[]
   * @param {request} [ExpressRequest] Object
   * @return {Bool} translated as [ExpressResponse] Object
   * */
  async delete(request, response) {
    
  }

  /**
   * Update an ObjectModel[]
   * @param {request} [ExpressRequest] Object
   * @return {Object} translated as [ExpressResponse] Object
   * */
  async update(request, response) {
    
    
  }
}

module.exports = new ChannelController()