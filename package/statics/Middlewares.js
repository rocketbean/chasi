const Base = require('../base')
const pluralize = require('pluralize')
const mongoose = require("mongoose")
const Schema = mongoose.Schema;
module.exports = class Middlewares extends Base {
  
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

  static assignMiddlewares(paths) {
    try {
      Object.keys(paths).map(key => {
        let mw = handle(`/container${paths[key]}`)
        Middlewares.$container[key] = mw
      })
    } catch(e) {
      console.log(e)
    }
  }
}