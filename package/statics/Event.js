const Model = require('./Models');
const Controller = require("./Controller")

class Event extends Controller {

  /**
   * called right after fire() 
   * method has been completed
   */
  async emitted () {
    Reflect.apply(this.props.afterEmit, this, [this.options])
  }
}

module.exports = Event