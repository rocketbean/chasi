const pluralize = require('pluralize')

module.exports = (argument) => {
  let uppercased = argument.charAt(0).toUpperCase()+argument.slice(1)
  return `
  const mongoose = require("mongoose")
  const __v = require("validator")
  
  let ${uppercased}Schema = new mongoose.Schema({
    /* *
    * Model Data Structure
    * */

  }, {
    timestamps: true
  })
  
  ${uppercased}Schema.methods.toJSON = function () {
    const ${argument} = this
    const ${argument}Object = ${argument}.toObject()

    return ${argument}Object;
  }
  
  
  const ${argument} = mongoose.model('${argument.toLowerCase()}', ${uppercased}Schema)
  module.exports = ${argument}`
}

