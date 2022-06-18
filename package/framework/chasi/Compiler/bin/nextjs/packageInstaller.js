const fs = require("fs");
const { exec } = require('child_process');
let now = new Date().toISOString();

module.exports =  async (path, state) => {
  return new Promise((res, rej) => {
    let load = log.loading("Installing npm package ")
    load.start();
    
    exec(`cd "${path}" && npm install `, (error, stdout, stderr) => {
      if (error) {
        state.logs.push(`${now} - ${error}`);
        rej(error)
        return;
      }

      load.stop();
      state.status.package = 1
      state.logs.push(`${now} - [PackageInstaller] package installed`)
      state.logs.push(`${now} - ${stdout}`);
      log.msg(`stdout: ${stdout}`);

      res(state);
    })
  })

}