const Base = require('../base')
const pluralize = require('pluralize')
const mongoose = require("mongoose")
const ModelExt = handle('/package/bootloader/ModelExt');
const extension = new ModelExt;
module.exports =  class Adapter extends Base {
  static property = {}
  static connections = {}
  static extension = new ModelExt()
  static init(property, connections) {
    Adapter.property = property
    Adapter.connections = connections
  }
  
  static getConnection(modelName, schema, con = undefined) {
    if(con == undefined) con = Adapter.property?.database?.default
    try {
      if(Adapter.connections.hasOwnProperty(con)) {
        let extension = new ModelExt;
        extension.install(schema)
        return Adapter.connections[con].model(modelName, schema)
      } else {
        if(!Adapter.connections.hasOwnProperty(Adapter.property?.database?.default)) {
          return { 
            model: (name, schema) => {
              console.log(name, "is called")
              let e = new Error(`${name} model is called before DB instance \n`);
              Adapter.pushStaticError(e.message, 0)
            }
          }
        }

      log.center(`
      [${con}] is not registered as a valid database connection, 
      the connection is defaulted to [${Adapter.property?.database?.default}]`, "warning")
        return Adapter.connections[Adapter.property?.database?.default]
      }
    } catch(e) {
      Adapter.pushStaticError(e.message, 3)
    }
  }
}
