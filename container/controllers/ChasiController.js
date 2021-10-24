
const Controller = require("../../package/statics/Controller");

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
    return `
      <html>
        <body style = "margin: 0; padding 0; height:100vh; width:100vw;">
          <div style = "height:100%; width:100%; flex-direction:column; display:flex; justify-content: center; align-items: center">
            <h2 style = "margin-bottom: 4px">
              <u>
                Chasi Framework
              </u>
            </h2>
            <small>
              build something amazing!
            </small>
          </div>
        </body>
      </html>
      `
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
  async update(request) {
    
    
  }
}

module.exports = new ChasiController()