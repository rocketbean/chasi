const Base = require('../base')
const pluralize = require('pluralize')
const mongoose = require("mongoose")
const Schema = mongoose.Schema;

module.exports = class Models extends Base {
  
  /**
   * [Mongoose::Model]
   * container of models
   */
  static $container = {}

  /**
   * map of the Model names that is 
   * different from the initial
   * declaration.
   */
  static $bindMap = {}

  static assignModels(paths) {
    let currentdir;
    try {
        paths.forEach( dir => {
          var buff = Models.staticStackDir(`${dir}`);
          buff.map(filedir => {
            if(filedir instanceof Error) {
              throw new Error(`${filedir} on ${filedir.constructor.modelName}`);
            }
            let key = Reflect.construct(filedir, []).constructor.modelName
            if(Models.$bindMap[key]) key = Models.$bindMap[key]
            Models.$container[key] = filedir
          })
        })
    } catch(e) {
      // console.log(currentdir.constructor)
      Models.pushStaticError(`[Schema::ModelAssignmentError] on \n ${e.stack}`, 0)
    }
  }
}