const path = require("path");
const fs = require("fs");
const { exec } = require('child_process');
let now = new Date().toISOString();

module.exports =  async (path, state) => {
  return new Promise((res, rej) => {
    log.msg(`Installing npm package...`);
    exec(`cd "${path}" && npm install `, (error, stdout, stderr) => {
      if (error) {
        state.logs.push(`${now} - ${err}`);
        return;
      }

      state.status.package = 1

      state.logs.push(`${now} - [PackageInstaller] package installed`)
      state.logs.push(`${now} - ${stdout}`);
      log.msg(`stdout: ${stdout}`);

      res(state);
    })
  })

}