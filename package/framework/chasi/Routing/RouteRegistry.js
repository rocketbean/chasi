const Router = require('./Router');
const log = require('../../../Logger');
const ErrorHandler = require('../../error/ErrorHandler');
const Events = require('../../../events');
const EventEmitter = require('events');
const { OutgoingCallerIdContext } = require('twilio/lib/rest/api/v2010/account/outgoingCallerId');

class RouteRegistry extends ErrorHandler{
    
    static $app;
    static $server;
    static $responses;
    static RouteCollection;
    static LogRoute = checkout(process.env.routeLogging, 0) > 0 ? true:false;
    
    constructor (stack, controllers, router) {
        super();
        this.activeRoutes = [];
        this.mounted = [];
        this.router = router
        this.stack = stack
        this.controllers = controllers;
        this.collector()
        this.pushRoutes();
    }

    collector () {
        if(RouteRegistry.LogRoute) log.msg(`RouteRegistry::${this.router}`, 65, "subsystem")
        Object.keys(this.stack).map(_r => {
            this.activateRoutes(this.stack[_r])
        })
        global.events.call('NewRouterEntry', {router: this.router, routes: this.mounted});

    }

    pushRoutes () {
        Object.keys(this.stack).map(_r => {
            this.registerRoute(this.stack[_r])
        })
    }


    activateRoutes (route) {
        route.fullpath = this.validateEndpoint(route);
        this.mounted.push({m: route.method.toUpperCase(), url: route.fullpath, route});
        if(RouteRegistry.LogRoute) {
            let len = 65;
            let msg = `${route.fullpath} | `
            let routeType = ` [${route.method.toUpperCase()}]`
            msg +=  routeType
            len += routeType.length;
            if(route.middlewares.length > 0) {
                let excess = ` [${route.middlewares.map(mw => mw)}]`;
                msg +=  excess
                len += excess.length;
            }
            log.msg(msg, len, "positive")
        }
        this.validateController(route); 
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
        return param
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
                if(!RouteRegistry.middlewares[middleware]) this.exception(`${middleware} is not a registered middleware`, 2, "danger");
                let mw = RouteRegistry.middlewares[middleware];
                route.options[middleware] = { use: RouteRegistry.middlewares[middleware], type: 'middleware'}
            })
        }
    }

    /***
     * assigns the controller to the route as endpoint
     * $app class (express) || [Controller]
     **/
    assignController (route) {
        route.options["controller"] = {use: async (req, res) => {
            try {
                req.app_session_id = route.id;
                let callable = await new Proxy(this.controllers[route.controller.constructor][route.controller.method], {
                    apply: async (target, property, args) => {
                        let im = args.find(arg => arg.constructor.name == 'IncomingMessage')
                        await this.bindModel(req, this.controllers[route.controller.constructor])
                        return await Reflect.apply(target, this.controllers[route.controller.constructor], [...args])
                    }
                })
                let _r = await callable(req)
                res.send(_r);
            } catch(e) {
                this.exception(e.stack + `\n Class[${route.controller.constructor}] :: Method(${route.controller.method})`, 1, "danger");
                if(e.status) {
                    res.status(e.status).send(e.message)
                    return
                }
                e.message = this.handleError(e);
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
        let message = RouteRegistry.$responses[e.constructor.name]?.code[e.code]
        if(!message) return RouteRegistry.$responses._default;
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