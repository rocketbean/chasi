import container from "../../config/container.js";
import {Injector} from "./injector.js";
import server from "../../config/server.js";
import {Base} from "../base.js";
import Negotiator from "../cluster.js";

export class Configurator extends Negotiator(Injector, Base) {

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
    }

    /**
     * Get Config properties
     * at basepath [./config]
     */
    async setProps () {
        var normalizedPath = this._g.path.join(basepath, "config");
        this.bootfiles = this._g.fs.readdirSync(normalizedPath).map(fn => {
            let _n = fn.replace('.js', ''); 
            return {[_n]: normalizedPath + "\\" + fn}
        });

        await Promise.all(this.bootfiles.map(async fp => {
            let reg = this.register.bind(this)
            await reg(fp) 
        }))
    }

    /**
     * enlist the file to registry
     * @param {registry} file 
     */
    async register (file) {
        try {
            let key = Object.keys(file);
            this._c[key] = (await import('file:///' + file[key])).default
        } catch(e) {
            console.log(e, `@2@@@@@ ERR ${ Object.keys(file) }`)
        }
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
