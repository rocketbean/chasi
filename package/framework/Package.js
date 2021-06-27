const Base =require("../base");

class PKG extends Base{
    static logging = process.env.adapterLogging > 0 ? true:false;
    
    constructor (alias, path, staticfunc) {
        super();
        this.alias = alias;
        this.path = path;
        this.staticfunc = staticfunc;
        this.status = 'listed'
        this.requireFile();
    }

    requireFile() {
        try{
            this._p = this.readFile(this.alias,this.path );
            if(PKG.logging) log.msg(`reading package:: ${this.alias} => ${this.path}`, 40, "positive")
        } catch(e) {
            this.exception(e.message, 1)
        }
    }

    callStatic() {
        if(typeof Base.ReadCon[this.alias][this.staticfunc] !== "function") this.exception(`[${this.alias}] missing static method ${this.staticfunc}()`, 2);
        return Base.ReadCon[this.alias][this.staticfunc](PKG.property, PKG._g, PKG.$server, PKG.$app);
    }
}

module.exports = PKG;