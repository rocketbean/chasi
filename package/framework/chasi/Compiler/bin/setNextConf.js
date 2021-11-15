const path = require("path");
const fs = require("fs");
const Base = handle("/package/base");

module.exports =  async (root, props) => {
  return new Promise(async (res, rej) => {
    let confpath = path.join(root, 'next.config.js')
    let load = log.loading("setting next config");
    let config;
    load.start();
    if(fs.existsSync(confpath)) config = require(confpath);
    else config = {};
    config.basePath = props.staticPath
    fs.writeFile(confpath, `module.exports = ${JSON.stringify(config, null, 2)}`, function (err) {
      if (err) rej(err);
      load.stop();
      res();
    });
    
  })

}