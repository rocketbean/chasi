class framework {
    static global;
    static property;
    constructor () {
        this.registry = {}
        this.bootstrap = {}
        this.stack = {}
        this.errors = [];
    }
    
    async callstack (_g) {
        _g.fs.readdirSync(__dirname).map(fn => {
            var _p = _g.path.join(__dirname, fn);
            if(_g.fs.statSync(_p).isDirectory()) {
                this.registry[fn] = _p
            }
        })
        await this.#bootStack();
        return this.bootstrap;
    }

    async #bootStack () {
        Object.keys(this.registry).map(boot => {
            try{
                this.stack[boot] = require(this.registry[boot])({global: framework.global, property: framework.property});
            } catch(e) {
                console.log(e.message) 
            }
        })
        return await this.#bootup();
    }

    async #bootup() {
        return await Object.keys(this.stack).map(async obj => {
            try {
                this.bootstrap[obj] = await this.stack[obj].init()
            } catch (e) {
                this.errors.push (e.message);
                console.log(e.message)
            }
        }, this)

    }

    static loadStaticProperty(global, property) {
        framework.global = global
        framework.property = property
    }
}

module.exports = framework