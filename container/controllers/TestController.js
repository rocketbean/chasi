
const Controller = require("../../package/statics/Controller");

class TestController extends Controller {

  /**
   * Write a New ModelEntry
   * @param {request} [ExpressRequest] Object
   * @return {} translated as [ExpressResponse] Object
   * */
  async create(request) {
    

  }

  /**
   * Single ObjectModel[index]
   * @param {request} [ExpressRequest] Object
   * @return {Object} translated as [ExpressResponse] Object
   * */
  async index(request) {
    return "success";

  }

  /**
   * List of ObjectModel[]
   * @param {request} [ExpressRequest] Object
   * @return {Array} translated as [ExpressResponse] Object
   * */
  async list(request) {
    
    
  }

  /**
   * Delete an ObjectModel[]
   * @param {request} [ExpressRequest] Object
   * @return {Bool} translated as [ExpressResponse] Object
   * */
  async delete(request) {
    
  }

  /**
   * Update an ObjectModel[]
   * @param {request} [ExpressRequest] Object
   * @return {Object} translated as [ExpressResponse] Object
   * */
  async delete(request) {
    
    
  }
}

module.exports = new TestController()