const Base = require('../../base');
const Router = require('./Routing/Router');
const Auth = require('./Authorization');
const OpenSocket = require('./OpenSocket');
const ServiceAdapter = require('./adapters/ServiceAdapter');
const adapter = require('./adapters/adapters');
const log = require("../../Logger");
const Controller = require("../../statics/Controller");

class Chasi extends Base {
    /**
     * $basepath [container];
     * Chasi Container path
     */
    static $basepath = 'container/';

    /**
     * $dependency [array];
     * list of class dependencies
     */
    static $dependency = [
        '$packages'
    ];

    /**
     * [$ServiceGuard] protected services;
     * list of protected service
     * this list will not be included
     * in the global service registry
     */
    static $ServiceGuard = [
        'routers',
        'auth',
        'sockets'
    ];

    static $packages;
    static $app;
    static $server;
    static $io;

    constructor () {
        super();
        this.autoLoadServiceBootstrap()
        this.internals = [];
        this.services = {};
    }

    async autoLoadServiceBootstrap () {
        this.services = new ServiceAdapter(Chasi.property.app.ServiceBootstrap).autoload();
        adapter.services = this.services
        this.propagateServices()
    }

    async propagateServices () {
        let service = {}
        Object.keys(this.services).forEach(serve => {
            if(!Chasi.$ServiceGuard.includes(serve)) 
                service[serve] = this.services[serve]
        })
        Controller.installServices(service)
    }
    
    async use ($instance, $options) {
        this.internals[$instance['name']] = $instance.install(this);
    }

    static VerifyInstallation (dependency, $chasi) {
        let passed = true
        Chasi.$dependency.forEach(_d => {
            if(!Object.keys(dependency).includes(_d)) passed = false;
        });
        if(!passed) 
            $chasi.exception("failed to boot installation, dependency did not meet the requirement", 3);
    }

    static install ($app, dependency) {
        Chasi.$app = $app;
        Chasi.$packages = dependency.$packages;
        Chasi.$server = dependency.$server;
        OpenSocket.init($app, Chasi.property, dependency.$io);
        Router.init($app, dependency.$server);
        Router.init($app, dependency.$server);
        Auth.init($app, Chasi.property.authentication);
        let $chasi = new Chasi();
        Chasi.VerifyInstallation(dependency, $chasi);
        return $chasi;
    }
}

module.exports = Chasi;