
const ErrorHandler = require('../../error/ErrorHandler');
class ServerWrapper extends ErrorHandler{
    static global;
    static property;

    constructor() {
        super();
        this.exprs = ServerWrapper.global.express
        this.app = null;
    }

    middleware () {
        return true;
    }

    async init() {
        if(this.middleware()) {
            this.app = this.exprs()
            return this.app;
        }
        else this.exception('Server did not pass Gate::middleware guard[s]', 2);
    }
    

    static bootstrap (global, property) {
        ServerWrapper.global = global
        ServerWrapper.property = property
    }
}

module.exports = (function (args) {
    ServerWrapper.bootstrap(args.global, args.property);
    return new ServerWrapper()
})