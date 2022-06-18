const pkg = require("../../defaults/nextjs/defaultPackage");
const path = require("path");
const fs = require("fs");
let now = new Date().toISOString();

module.exports = async (root, props, state) => {
  return new Promise((res, rej) => {
    let filepath = path.join(root, "package.json");
    let staticDir = path.join(basepath, props.staticDir)
    let load = log.loading("checking package script")
    if(!fs.existsSync(filepath)) {
      load.start();
      fs.writeFile(filepath, pkg(props.staticDir), function (err) {
        if (err) {
          state.logs.push(`${now} - ${err}`);
          rej(state)
        }
        load.stop()
        state.logs.push(`${now} - deployed package script`)
        state.status.package = 0
        res(state);
      });
    } else {
      res(state);
    }
  })
}