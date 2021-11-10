
const Base = handle("/package/base");
class View extends Base{

  async builder (property) {
    let template = Object.keys(property)[0]
    try {
      var data = property?.data
      if(!data) data = {}
      var component = (key, params) => {
        try {
          let parsed;
          if(params) data[key] = params;
          if(property[template].hasOwnProperty(key))
            parsed = property[template][key]
          else parsed = key
          if(this.components.hasOwnProperty(parsed))
            return eval(this.components[parsed].raw)
          else return "";
        } catch(e) {
          throw new Error(`CompilerError::error loading Component[${key}] \n ${e.stack}`)
        }
      }

      var asset = (key) => {
        try {
          let parsed;
          if(property[template].hasOwnProperty(key))
            parsed = property[template][key]
          else parsed = key
    
          if(this.assets.hasOwnProperty(parsed))
            return eval(this.assets[parsed].raw)
          else return "";
        } catch(e) {
          throw new Error(`CompilerError::error loading Component[${key}] \n ${e.stack}`)
        }
      }

      var logic = function (callback, params = {}) {
        let cb = callback.bind(this)
        return cb(params);
      }

      return eval(this.templates[template].raw)
    } catch (e) {
      throw new Error(`CompilerError::error loading template[${template}] \n ${e.stack}`)
    }
  }


}
module.exports = View;