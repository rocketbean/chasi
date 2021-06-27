const Base = require('../../../base');
const baseroute = require('./Route');
const RouteGroup = require('./RouteGroup');
const Route = require('./Route');
const mongoose = require("mongoose")
const ObjectId = mongoose.Types.ObjectId; 
const log = require('../../../Logger')
class RouteManager extends Base{
    static $RoutePath = '/routes';
    static $app;
    static $server;
    static $groups = [];

    constructor (property){
        super();
        this.router      = property.router
        this.middlewares = property.middleware;
        this.groups      = [];
        this.prefixes      = [];
        this.registry    = {};
        this.listed      = {};
        this.routed      = [];
        this.controllers = {};
        this.activeRoutes= {};
        this.sanitized = false;
        this.loadControllers(property.ControllerDir);
    }

    loadControllers (dir) {
        let ef = '';
        try {
            var buff = this.stackDir(`container/${dir}`);
            buff.map(filedir => {
                if(filedir instanceof Error) throw new Error(filedir.message);
                this.controllers[filedir.constructor.name] = filedir
            })
        } catch(e) {
            this.exception(e.message + `\ncontroller:: error at ${buff}`, 3);
        }
    }

    middleware (middleware) {
        if(Array.isArray(middleware)) {
            middleware.map(m => {
                this.pushMiddleware(m);
            })
        } else {
            this.pushMiddleware(middleware)
        }
    }

    pushMiddleware (middleware) {
        if(!this.middlewares.includes(middleware)) {
            if(middleware) this.middlewares.push(middleware)
        }
    }

    group (group) {
        if(Array.isArray(group)) {
            group.map(g => {
                this.groups.push(g);
            })
        } else {
            this.groups.push(group)
        }
    }
    
    setPrefix (prefix) {
        if(Array.isArray(prefix)) {
            prefix.map(p => {
                this.prefixes.push(p);
            })
        } else {
            this.prefixes.push(prefix)
        }
    }

    readNameSpace(namespace) {
        try {
            Route.prefer = this.addRoute.bind(this);
            let _p = '/container' + RouteManager.$RoutePath + namespace;
            this.registry[namespace] = this.assignFile(_p).bind(this);
            this.registry[namespace]()
            return;
        } catch(e) {
            this.exception(e.stack,2)
        }
    }

    addRoute (route) {
        try {
            let id = ObjectId()
            this.listed[id] = route;
            route.setId(id);
        } catch(e) {
            this.exception(e.stack,2)
        }

    }

    sanitizeList () {
        if(!this.sanitized) {
            Object.keys(this.listed).forEach(async route => {
                this.listed[route].prefix(this.prefixes)
                this.listed[route].middleware(this.middlewares)
            });
            this.sanitized = true;
        }
    }

    static init($app,$server) {
        RouteManager.$app = $app;
        RouteManager.$server = $server;
    }
    
}

module.exports = RouteManager;