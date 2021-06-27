
const pkg = require('./Package');
const Base = require('../base');

class PackageLoader extends Base{
    static registry = [];
    static pkgs = {};
    static packages = {};
    static logging = process.env.adapterLogging > 0 ? true:false;
    constructor () {
        super();
        this.verifyLoadPack();
        this.RegisterPackages();
        this.installedPackages = {};
        this.boot();
    }

    verifyLoadPack () {
        if(!PackageLoader.property.app.hasOwnProperty('LoadPack')) this.exception('Loadpack list is missing! no package will be loaded in the container',0);
    }

    RegisterPackages () {
        this.registry = PackageLoader.property.app.LoadPack;
    }

    boot() {
        this.locatePackage()
        this.installPackages();
    }

    locatePackage () {
        Object.keys(this.registry).forEach(_p => {
            let str = this.sanitizePathStr(this.registry[_p]);
            PackageLoader.pkgs[_p] = new pkg(_p, str[0], str[1]);
        });
    }


    installPackages () {
        Object.keys(PackageLoader.pkgs).forEach(_p => {
            try{
                this.installedPackages[_p] = PackageLoader.pkgs[_p].callStatic();
                PackageLoader.packages[_p] = this.installedPackages[_p]
                if(PackageLoader.logging) log.msg(`installed package:: ${_p}`, 80, "positive")
            } catch(e) {
                this.exception(e.message, 1)
            }
        });
    }


    sanitizePathStr (str) {
        return str.split("::");
    }

    static package (p) {
        return PackageLoader.packages[p];
    }

}

module.exports = PackageLoader