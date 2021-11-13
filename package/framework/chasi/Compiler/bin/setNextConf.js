const path = require("path");
const fs = require("fs");
const Base = handle("/package/base");

module.exports =  async (root, props) => {
  return new Promise(async (res, rej) => {
    let confpath = path.join(root, 'next.config.js')
    let config = require(confpath);
    config.basePath = props.staticPath


    fs.writeFile(confpath, `module.exports = ${JSON.stringify(config, null, 2)}`, function (err) {
      if (err) rej(err);
      res();
    });
    
  })

}