
const Controller = handle("/package/statics/Controller");

class StreamController extends Controller {

  get engine () {
    return this.services.StreamEngine;
  }

  /**
   * Write a New ModelEntry
   * @param {request} [ExpressRequest] Object
   * @return {} translated as [ExpressResponse] Object
   * */
  async create(request, response) {
    let channel = await this.engine.createChannel()
    return channel;
  }

  /**
   * Single ObjectModel[index]
   * @param {request} [ExpressRequest] Object
   * @return {Object} translated as [ExpressResponse] Object
   * */
   async client(request, response) {
     try {
      return await this.engine.createClient();
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
    
    return this.engine.channels;
  }

  async clientList (request, response) {
    return this.engine.clients;
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

module.exports = new StreamController()