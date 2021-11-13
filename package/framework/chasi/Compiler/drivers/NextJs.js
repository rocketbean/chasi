const Driver = require("../Driver");
const path = require("path");
const fs = require("fs");
const conf = require("../defaults/defaultConf");
const fsinstaller = require("../bin/fileServerInstaller.js");
const PkgInstaller = require("../bin/packageInstaller.js");
const getInstanceProperties = require("../bin/getInstanceProperties.js");
const npmscript = require("../bin/installNpmScript");
const setNext = require("../bin/setNextConf");
const express = require("express")

class NextJs extends Driver {

  constructor (property) {
    super();
    this.root = '';
    this.property = property;
    this.setAbsolutePath();
    this.state = {}
  }

  setAbsolutePath() {
    if(this.property.useAbsolutePath) {
      this.root = this.property.root
    } else {
      this.root = path.join(basepath, this.property.root);
    }
    this.property.load.dir = this.root;
  }

  logger(message) {
    log.full(message, 'warning')
  }

  async start (server) {
    await this.verifyInstallation()
    let instance = require(path.join(this.root, this.property.fileServer));
    let props = await getInstanceProperties(this.root);
    await this.setStatic(server)
    return await instance(server, this.property.load, props);
  }

  async setStatic(server) {
    if(this.property.useStatic) {
      let staticDir = path.join(basepath, this.property.staticDir)
      console.log(staticDir)
      server.use(this.property.staticPath,
        express.static(staticDir)
      );
    }
  }

  async verifyInstallation () {
    try {
      let state = await this.getStateFile();
      if(state.status.fileserver < 1) {
        state = await fsinstaller(this.root, this.property.fileServer, state, this.property.load);
        await this.updateConf(state);
        this.logger('[FSInstaller] deployed fileserver script');
      }

      if(state.status.package < 1) {
        state = await PkgInstaller(this.root, state);
        await this.updateConf(state);
        this.logger('[PackageInstaller] package installed');
      }

      await npmscript(this.root, this.property);
      await setNext(this.root, this.property);


    } catch(e) {
      console.log(e)
    }
  }

  async getStateFile () {
    try {
      let statePath = path.join(this.root, 'chasi.conf');
      if(!fs.existsSync(statePath)) {
        await this.createStateFile();
      }
      return require(statePath)
    } catch (e) {
      this.exception("Compiler::Error error reading StateFile", 2)
    }
  }

  async updateConf (state) {
    return new Promise((res, rej) => {
      fs.writeFile(path.join(this.root, 'chasi.conf'), `module.exports = ${JSON.stringify(state, null, 2)}`, function (err) {
        if (err) rej(err);
        res();
      });
    })
  }

  async createStateFile () {
    return new Promise((res, rej) => {
      fs.appendFile(path.join(this.root, 'chasi.conf'), conf, function (err) {
        if (err) rej(err);
        res();
      });
    })
  }
  
  static async boot (property) {
    log.center(`Boot CompilerEngine::NextJs `, 'subsystem')
    return new NextJs(property);
  }
}

module.exports = NextJs;