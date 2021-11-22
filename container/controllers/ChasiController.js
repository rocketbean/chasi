
const Controller = handle("/package/statics/Controller");

class ChasiController extends Controller {

  /**
   * Write a New ModelEntry
   * @param {request} [ExpressRequest] Object
   * @return {} translated as [ExpressResponse] Object
   * */
  async create(request, response) {
    
  }

  /**
   * Single ObjectModel[index]
   * @param {request} [ExpressRequest] Object
   * @return {Object} translated as [ExpressResponse] Object
   * */
  async index(request, response) {

    try {
      return await this.compiler.render(request, response, '/')
    } catch(e) {
      throw {
        message: e.message,
        status: 400
      }
    }
  }

  /**
   * Single ObjectModel[index]
   * @param {request} [ExpressRequest] Object
   * @return {Object} translated as [ExpressResponse] Object
   * */
  async welcome(request, response) {
    let { name } = request.params;
    try {
      return await this.compiler.render(request, response, '/welcome', {name})
    } catch(e) {
      throw {
        message: e.message,
        status: 400
      }
    }
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

module.exports = new ChasiController()