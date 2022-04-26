const Router = require('./Router');
const log = require('../../../Logger');
const ErrorHandler = require('../../error/ErrorHandler');
const Events = require('../../../events');
const EventEmitter = require('events');
const Middlewares = handle("/package/statics/Middlewares");

class RouteRegistry extends ErrorHandler{
    
    static $app;
    static $server;
    static $responses;
    static RouteCollection;
    
    constructor (stack, controllers, property) {
        super();
        this.activeRoutes = [];
        this.mounted = [];
        this.router = property.name
        this.property = property
        this.stack = stack
        this.controllers = controllers;
        this.LogRoute = checkout(process.env.routeLogging, 1) > 0 ? true:false;
        this.collector()
        this.pushRoutes();
    }

    collector () {
        let GateWayAuth = this.property.gateway.enabled ? "ENABLED" : "DISABLED";
        if(this.LogRoute) {
            log.full(" ", "system")
            log.center({
                left: [{
                    text: `[AuthGW::${GateWayAuth}]`,
                    type: 'cool'
                }],
                message: `RouteContainer::[${this.router.capitalize()}]`,
            }, "subsystem")

        } 
        Object.keys(this.stack).map(_r => {
            this.readExemptions(this.stack[_r]);
            this.activateRoutes(this.stack[_r])
        })
        global.events.call('NewRouterEntry', {router: this.router, routes: this.mounted});
    }

    pushRoutes () {
        Object.keys(this.stack).map(_r => {
            this.registerRoute(this.stack[_r])

        })
    }
    
    readExemptions (route) {
        route.fullpath = this.validateEndpoint(route);
        route.exemptions.forEach(ex => {
            let indx = route.middlewares.indexOf(ex);
            if(indx > -1) route.middlewares.splice(indx, 1)
        })
    }

    activateRoutes (route) {
        route.container = this.property
        route.fullpath = this.validateEndpoint(route);
        this.mounted.push({m: route.method.toUpperCase(), url: route.fullpath, route});
        if(this.LogRoute) {
            let msg = `${route.fullpath}|`
            let color = this.checkGwExceptions(route) ? 'magenta' : 'positive'
            let routeType = {
                text: `[${route.method.toUpperCase()}]`,
                type: 'warning'
            }
            let excess= [];
            if(route.middlewares.length > 0)
                excess.push({
                    text: `${route.middlewares.map(mw => `[${mw}]`)}`,
                    type: 'cool'
                });
            log.startTrace({
                left: [routeType],
                message: msg,
                right: [...excess],
            }, color, '-')
        }
        this.validateController(route); 
    }

    checkGwExceptions(route) {
        let _excptn = this.property.gateway.AuthRouteExceptions.
            find(_r => (_r.url == route.fullpath.toLowerCase() && _r.m.toLowerCase() == route.method.toLowerCase()));
        if(!(route.container.gateway.enabled)) return true
        return _excptn ? true : false;
    }

    validateController (route) {
        if(!this.controllers[route.controller.constructor][route.controller.method]) {
            this.exception(`invalid route controller binding | [${route.controller.constructor}](${route.controller.method})`, 1)
        }
    }

    validateEndpoint(route) {
        route.endpoint = this.validPathStartString(route.endpoint)
        let param=route.prefixes.join() + route.endpoint;
        param = param.replace(/,/g, '');
        param = param.replace(/\/\//g, '');
        param = this.validPathStartString(param)
        return param.UrlStringFormat()
    }
    

    validPathStartString (str) {
        if(str[0] !== '/') str = '/'.concat(str);
        return str;
    }

    /***
     * registers the route fullpath to
     * | $app class (express)
     **/
    registerRoute (route) {
        let _route;
        this.assignMiddleware(route)
        this.assignController(route)
        let options = this.optionCollector(route)
        _route = RouteRegistry.$app[route.method](route.fullpath, ...options)
        route.layer = RouteRegistry.$app.getRouteLayer(route.fullpath, route.method)
        route.layer.route.id = route.id
        let routes = RouteRegistry.$app._router.stack.filter(st => st.route!=undefined);
        let indx = routes.find(r => r.route.path == route.fullpath);
        indx.route.network = this.router
        indx.route.app_session_id = route.id
        this.mounted.push(_route)
        this.activeRoutes.push(route.fullpath)
    }

    /**
     * Route~Middleware assignment`
     * @param {Middleware} route 
     * @param {*} options
     */
    assignMiddleware (route, options) {
        if(route.middlewares.length > 0) {
            route.middlewares.forEach(middleware => {
                if(!Middlewares.$container[middleware]) this.exception(`${middleware} is not a registered middleware`, 2, "danger");
                let mw = Middlewares.$container[middleware];
                route.options[middleware] = { use: Middlewares.$container[middleware], type: 'middleware'}
            })
        }
    }

    /***
     * assigns the controller to the route as endpoint
     * $app class (express) || [Controller]
     **/
    assignController (route) {
        route.options["controller"] = {use: async (req, res, render = {}) => {
            try {
                req.app_session_id = route.id;
                let callable = await new Proxy(this.controllers[route.controller.constructor][route.controller.method], {
                    apply: async (target, property, args) => {
                        let im = args.find(arg => arg.constructor.name == 'IncomingMessage')
                        await this.bindModel(req, this.controllers[route.controller.constructor])
                        return await Reflect.apply(target, this.controllers[route.controller.constructor], [...args])
                    }
                })
                let _r = await callable(req, res)
                res.send(_r);
            } catch(e) {
                let message = e.stack ? e.stack : e.message;
                message += `\n [${route.controller.constructor}] :: Method(${route.controller.method})`;
                this.exception(message, 1,route.controller.method);
                e.message = this.handleError(e);

                if(e.status) {
                    res.status(e.status).send(e.message)
                    return
                }
                
                res.status(400).send(e.message)
            }
        }, type: 'controller'}
        return;
    }

    /**
     * 
     * @param {Error} e 
     * @returns Sanitized error message
     */
    handleError (e) {
        let message = RouteRegistry.$responses[e.status]
        if(e.message) return this.sanitize(e.message,e )
        else return this.sanitize(message,e )
    }

    sanitize(message,e) {
        if(message.includes("${field}")) {
            let regExp = /\${([^)]+)\}/;
            let matches = regExp.exec(message);
            message = message.replace(matches[0], JSON.stringify(Object.keys(e.keyPattern)))
        }
        return message;
    }

    /***
     * automatically assigns the model
     * with the ID
     * class (Model) || [Controller]
     **/
    async bindModel(req, instance) {
        if(Object.keys(req.params).length > 0) {
            if(!req.slug) req.slug = {}
            return await Promise.all(Object.keys(req.params).map(async key => {
                let model = instance.model(key)
                if(model) {
                    req.params[`_${key}`] = await model.findById(req.params[key]);
                } else {
                    req.params[`_${key}`] = req.params[key];
                }
            }))
        }
    }

    /***
     * positioning the options to be spread 
     * at the route registry
     *  [Object][Array]
     **/
    optionCollector (route) {
        if((typeof route.options) !=="object") throw new Error(`${route.fullpath}::routing options must be an object`)
        return Object.keys(route.options).map( option => {
            if(route.options[option].use.constructor.name != 'AsyncFunction') {
                this.exception(`${route.fullpath}:: execute function must be async`, 2, "danger");
            }

            if(route.options[option].type) {
                if((route.options[option].type != 'controller') || (route.options[option].type != 'middleware')) {
                    return route.options[option].use;
                }
            } else {
                return async (req, res, next) => {
                    try {
                        await route.options[option].use(req, res);
                        next()
                    } catch(e) {
                        this.exception(e.message + `[${route.options[option].use.constructor.name}] :: (${option})`, 0, "danger");
                        res.status(400).send(`${e.message} :: error at non-controlled method`)
                    }
                }
            }
        })
    }

    /***
     * initializes property needed
     * before running
     * [RouteRegistry] => [$app || $server]
     **/
    static init ($app, $server, property) {
        RouteRegistry.$app = $app;
        RouteRegistry.$server = $server;
        RouteRegistry.$responses = property['error-responses'];
        RouteRegistry.middlewares = property.app.middlewares;
    }
}

module.exports = RouteRegistry;