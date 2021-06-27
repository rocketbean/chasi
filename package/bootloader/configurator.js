const container = require('../../config/container');
const Injector = require('./injector');
const server = require('../../config/server');
const Base = require('../base');
const Negotiator = require('../cluster');

class Configurator extends Negotiator(Injector, Base) {

    /**
     * Removes from readers list of autoloaded configurations
     */
    static autoLoadException = ['container', 'cors', 'database'];

    /**
     * Removes from readers list of autoloaded configurations
     */
    static ContainerPropertyLoadException = ['name', 'mode', 'environment'];
    
    constructor () {
        super();
        this.container = container;
        this.bootfiles = [];
        this._c = {}
        this.setProps()

    }

    /**
     * Get Config properties
     * at basepath [./config]
     */
    setProps () {
        var normalizedPath = this._g.path.join(basepath, "config");
        this.bootfiles = this._g.fs.readdirSync(normalizedPath).map(fn => {
            let _n = fn.replace('.js', ''); 
            return {[_n]: normalizedPath + "/" + fn}
        }).map(this.register.bind(this));

    }

    /**
     * enlist the file to registry
     * @param {registry} file 
     */
    register (file) {
        let key = Object.keys(file);
        this._c[key] = require(file[key]);
    }

    /**
     * start bootstrapping 
     * configurations
     */
    bootload () {
        let extras = this.autoLoadConfigs();
        return {
            app: this.configureApp(),
            database: this.getDatabaseEnv(),
            cors: this.getCorsOption(),
            ...extras
        }
    }

    /**
     * config stacking &
     * excludes pre populated fields
     */
    autoLoadConfigs () {
        return this.excludeFromProperty(Configurator.autoLoadException,this._c);
    }

    /**
     * static bootstrap
     * {App}
     */
    configureApp () {
        let args = this.excludeFromProperty(Configurator.ContainerPropertyLoadException, this._c.container)
        return {
            name: this._c.container.name,
            mode: this._c.container.environment,
            cert: this.keySelector(this._c.container.mode, this._c.container.environment),
            ...args
        };
    }

    /**
     * static bootstrap
     * {Cors}
     */
    getCorsOption () {
        return {
            origin: this._c.cors.origin,
            allowedHeaders: this._c.cors.allowedHeaders,
            credentials: this._c.cors.credentials,
            enablePreflight: this._c.cors.enablePreflight,
        };
    }
    
    /**
     * static bootstrap
     * {Database}
     */
    getDatabaseEnv () {
        return {
            host: this._c.database.host,
            bootWithDB: this._c.database.bootWithDB,
            connection: this.keySelector(this._c.database.options, this._c.database.host)
        };
    }

}

module.exports = Configurator;