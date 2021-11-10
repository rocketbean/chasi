
const Controller = handle("/package/statics/Controller");
const EventEmitter = require('events');
const User = require('../Models/User');

class ChasiController extends Controller {

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
    return await this.compiler.view({static: {}})
  }

  /**
   * Docs[main]
   * @param {request} [ExpressRequest] Object
   * @return {Array} translated as [ExpressResponse] Object
   * */
  async docs(request) {

    let content;

    if(!request.params.doc) content = "content"
    else content = request.params.doc

    return await this.compiler.view({
      docs: { content },
      data: {
        listings: [
          {
            title: "installation",
            url: "/chasi/docs/installation",
          },
          {
            title: "config",
            url: "/chasi/docs/config",
          },
          {
            title: "scripts",
            url: "/chasi/docs/scripts",
          },
          {
            title: "database",
            url: "/chasi/docs/database",
          },
        ]
      }
    })
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
  async update(request) {
    
    
  }
}

module.exports = new ChasiController()