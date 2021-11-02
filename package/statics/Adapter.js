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
    if(con == undefined) con = Adapter.property?.database?.default
    if(Adapter.connections.hasOwnProperty(con)) {
      return Adapter.connections[con]
    } else {
      return mongoose
    }
  }
}
