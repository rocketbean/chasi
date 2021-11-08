const Base = require('../base')
const pluralize = require('pluralize')

module.exports = class Model extends Base {
  
  /**
   * [Mongoose::Model]
   * container of models
   */
  static $models = {}

  /**
   * map of the Model names that is 
   * different from the initial
   * declaration.
   */
  static $bindMap = {}

  static assignModels(paths) {
    try {
        paths.forEach( dir => {
            var buff = Model.staticStackDir(`${dir}`);
            buff.map(filedir => {
              if(filedir instanceof Error) throw new Error(filedir.message);
              let key = Reflect.construct(filedir, []).constructor.modelName
              if(Model.$bindMap[key]) key = Model.$bindMap[key]
              Model.$models[key] = filedir
            })
        })
    } catch(e) {
      this.exception(e.message, 0)
    }
  }
}