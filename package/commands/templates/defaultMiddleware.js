module.exports = (argument) => {
  return `
  const SessionStorage = handle("/package/framework/storage/session")
  const User = require("../Models/User");

  /*
  * * *
  * 
  * @params {request, response, next}
  * @request [ExpressRequest]
  * @response [ExpressResponse]
  * 
  * @next [Fn] ()
  * * *
  */
  module.exports = async (request, response, next) => {


    
    next();
  }`
}

