const Base = require('../base')
const pluralize = require('pluralize')

module.exports =  class Adapter extends Base {
  static property = {}
  static init(property) {
    Adapter.property = property
  }
}
