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
      if(Adapter?.connections && Adapter.connections.hasOwnProperty(con)) {
        return Adapter.connections[con]
      } else {
        if(!(Adapter?.connections?.hasOwnProperty[Adapter.property?.database?.default])) {
          return { 
            model: function(name, schema) {
              return schema
            }
          }
        }
        return Adapter.connections[Adapter.property?.database?.default]
      }
    } catch(e) {
      console.log(e.stack)
      // this.exception(e.message, 0)
    }
  }
}
