const RouteManager = require("./Manager");
const RouteRegistry = require('./RouteRegistry');

const Base = require("../../../base");

class Router extends Base {
    static $app;
    static $server;

    constructor (args) {
        super();
        this.setProperty(args);
        this.setRouteManager();
        this.loadRoutes();
    }

    setProperty(args) {
        this.property = {
            name          : this.removeSpaces( this.cleanString(args.name)),
            prefix        : this.removeSpaces( this.cleanString(args.prefix,['/'])),
            namespace     : this.removeSpaces( this.cleanString(args.namespace,['/', '.'])),
            ControllerDir : this.removeSpaces( this.cleanString(args.ControllerDir,['/', '.'])),
            middleware    : args.middleware,
        }
    }

    setRouteManager() {
        this.manager = new RouteManager(this.property);
        this.manager.middleware(this.property.middleware)
        this.manager.setPrefix(this.property.prefix)
        this.manager.readNameSpace(this.property.namespace)
    }

    loadRoutes () {
        this.manager.sanitizeList();
        this.registry = new RouteRegistry(this.manager.listed, this.manager.controllers, this.property.name)
    }


    static init($app, $server) {

        Router.$app = $app;
        Router.$server = $server;
        RouteManager.init($app, $server);
        RouteRegistry.init($app, $server, Router.property);
    }
}

module.exports = Router;