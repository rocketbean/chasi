const Base = require("../base");
const path = require("path");
const fs = require("fs");

class ObserverRegistry extends Base {

  async registerPath (dir) {
    try {
      var normalizedPath = path.join(basepath, dir);
      return fs.readdirSync(normalizedPath).map(eventFile => {
        return this.assignEvent(`${dir}${eventFile}`);
      });
    } catch (e) {
      console.log(e.stack) 
    }
  }

  assignEvent (eventFile) {
    return require(path.join(basepath, eventFile))
  }
  
}

module.exports = ObserverRegistry;