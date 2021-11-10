const Base = require('../base')
const pluralize = require('pluralize')
const mongoose = require("mongoose")

module.exports =  class Adapter extends Base {
  static property = {}
  static connections = {}
  
  static init(property, connections) {
    Adapter.property = property
    Adapter.connections = connections
  }
  
  static getConnection(con) {
    try {
      if(con == undefined) con = Adapter.property?.database?.default
      if(Adapter.connections.hasOwnProperty(con)) {
        return Adapter.connections[con]
      } else {
        if(!Adapter.connections.hasOwnProperty(Adapter.property?.database?.default)) {
          return { 
            model: function(name, schema) {
              return schema
            }
          }
        }

      log.center(`
      [${con}] is not registered as a valid database connection, 
      the connection is defaulted to [${Adapter.property?.database?.default}]`, "warning")

        return Adapter.connections[Adapter.property?.database?.default]
      }
    } catch(e) {
      this.exception(e.message, 0)
    }
  }
}
