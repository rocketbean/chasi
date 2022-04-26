const Driver = require("../Driver");
const path = require("path");
const fs = require("fs");
const conf = require("../defaults/defaultConf");
const fsinstaller = require("../bin/fileServerInstaller.js");
const checkPackage = require("../bin/checkPackage.js");
const PkgInstaller = require("../bin/packageInstaller.js");
const getInstanceProperties = require("../bin/getInstanceProperties.js");
const npmscript = require("../bin/installNpmScript");
const setNext = require("../bin/setNextConf");
const buildScript = require("../bin/buildScript");
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
    let load = log.loading("compiling features ");
    await this.verifyInstallation()
    let instance = require(path.join(this.root, this.property.fileServer));
    let props = await getInstanceProperties(this.root);
    await this.setStatic(server)
    load.start()
    instance = await instance(server, this.property.load, props);
    load.stop()
    return instance
  }

  async setStatic(server) {
    if(this.property.useStatic) {
      let staticDir = path.join(basepath, this.property.staticDir)
      server.use(this.property.staticPath,
        express.static(staticDir)
      );
    }
  }

  async buildStatic () {
      return await buildScript(this.root, this.state)
  }

  async verifyInstallation () {
    try {
      this.state = await this.getStateFile();
      if(this.state.status.fileserver < 1) {
        this.state = await fsinstaller(this.root, this.property.fileServer, this.state, this.property.load);
        await this.updateConf(this.state);
        this.logger('[FSInstaller] deployed fileserver script');
      }

      this.state = await checkPackage(this.root, this.property, this.state);

      if(this.state.status.package < 1) {
        this.state = await PkgInstaller(this.root, this.state);
        await this.updateConf(this.state);
        this.logger('[PackageInstaller] package installed');
      }

      await npmscript(this.root, this.property);
      await setNext(this.root, this.property);


    } catch(e) {
      this.exception(`Compiler::Error ${e.message}`, 2)
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