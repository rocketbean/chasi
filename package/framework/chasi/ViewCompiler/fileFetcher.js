const Base = require("../../../base");
const fs = require("fs");

class Fetcher extends Base {

  constructor (path) {
    super();
    this.path = path
    this.raw = false
  }


  fetch () {
    const buffer = fs.readFileSync(`${basepath}/${this.path}`);
    this.raw = "`" + buffer.toString() +"`";
  }
}

module.exports = Fetcher
