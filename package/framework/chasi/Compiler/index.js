
const Base = handle('/package/base');
const path = require('path');

class Compiler extends Base {
  static dir = `${basepath}/package/framework/chasi/Compiler/drivers`

  constructor (property) {
    super()
    this.property = property;
    this.drivers = {}
    this.engine = {}
  }

  async loadDriver () {
    this.engine = this.drivers[this.property.driver]
  }

  async setDrivers () {
      (await Compiler.throughDirs(Compiler.dir)).map(async driver => {
        Object.keys(driver).forEach(async name => {
          let drivername = name.replace(path.extname(name), "");
          let script = require(driver[name])
          this.drivers[drivername] = await script.boot(this.property.configs[drivername])
        })
      });

  }

  async setup () {
      await this.setDrivers();
      await this.loadDriver();

  }

  static init (property) {

    return new Compiler(property.compiler);

  }

}

module.exports = Compiler;