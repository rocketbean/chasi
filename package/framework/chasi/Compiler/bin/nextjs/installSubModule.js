const path = require("path");
const fs = require("fs");
const Base = handle("/package/base");
const { exec } = require('child_process');
let now = new Date().toISOString();

module.exports =  async (path, property, state) => {
  return new Promise(async (res, rej) => {
    if(property.submodule.enabled) {
      let load = log.loading("Installing SubModules ")
      load.start();
      console.log(path)
      exec(`cd "${path}" && git submodule add -f ${property.submodule.path} && cp -r Chasi-Next/* ./ && git rm -rf Chasi-Next`, (error, stdout, stderr) => {
        if (error) {
          state.logs.push(`${now} - ${error}`);
          rej(error)
          return;
        }

        load.stop();
        state.status.submodule = 1
        state.logs.push(`${now} - [SubmoduleInstaller] submodule installed`)
        state.logs.push(`${now} - ${stdout}`);
        log.msg(`stdout: ${stdout}`);

        res(state);
      })
    }
  })

}
