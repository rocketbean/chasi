const _p = require("path");
const fs = require("fs");
const { exec } = require('child_process');
let now = new Date().toISOString();

module.exports =  async (path, state) => {
  return new Promise(async (res, rej) => {
    let load = log.loading("build features as static ");
    load.start();
    let oldExp = require(_p.join(path, "next.config.js"));
    oldExp.distDir = Date.now()+"_temp";
    new Promise((resolver, rej) =>{
      fs.writeFile(_p.join(path, "next.config.js"), `module.exports = ${JSON.stringify(oldExp, null, 2)}`, function (err) {
        if (err) rej(err);
        resolver();
      });
    }).then( r => {
      exec(`cd "${path}" && npm run build `, (error, stdout, stderr) => {
        if (error) {
          load.stop();
          console.log(error, stderr)
          state.logs.push(`${now} - ${error}`);
          rej(error)
        }
        load.stop();
        state.status.package = 1
        state.logs.push(`${now} - [CompilerEngine] CompileSuccess`)
        state.logs.push(`${now} - ${stdout}`);
        log.msg(`stdout: ${stdout}`);
        fs.rmdir(_p.join(path, oldExp.distDir), { recursive: true, force: true }, (err) => {
          if(err) console.log(err, "@rm at temp build")
          delete oldExp.distDir
          fs.writeFile(_p.join(path, "next.config.js"), `module.exports = ${JSON.stringify(oldExp, null, 2)}`, function (err) {
            if(err) console.log(err, "@rm at temp build")
          });
        })
        res(state);
      })
    })

  }).catch(e => {})

}