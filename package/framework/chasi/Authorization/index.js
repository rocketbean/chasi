const Events  = require ('../../../events')
const EventEmitter = require('events');
const JWTDriver = require('./jwt')

class AuthorizationDriver {
    /**
     * Allowed Authentication Drivers
     */
    static $drivers = ['jwt', 'session'];
    static $instances = {};
    static $app;
    static property;
    static routes = {};

    constructor () {
        
    }

    static SetGuards(params) {
        let _c = AuthorizationDriver.property.gateway[params.router]
        let reflector = Reflect.construct(JWTDriver, [_c, params.router])
        AuthorizationDriver.$instances[params.router] = reflector
        AuthorizationDriver.register(params, reflector)
        if(_c !== undefined) {
            AuthorizationDriver.$app.use(Reflect.apply(reflector.setAuthorization, AuthorizationDriver.$instances[params.router], []))
        } else {
            AuthorizationDriver.setRouteGuardException(params)
        }
    }

    static register (params, reflector) {
        params.routes.map(r => {
            AuthorizationDriver.routes[r.route.id] = {
                method: r.m,
                url: r.url,
                target: reflector 
            }
        })
    }

    static setRouteGuardException (params) {
        Object.keys(AuthorizationDriver.$instances).map(r => {
            AuthorizationDriver.$instances[r].addTokenExceptions(params.routes)
        })
    }
    
    static implementAppGuard (layer) {
        let route = AuthorizationDriver.routes[layer.route.id]
        if(route.url == '/users/') {
            console.log(new URL(route.url))
            console.log(route.target.property.AuthRouteExceptions)
        }
        if(!route) console.dir(layer)
        let unguarded = route.target.property.AuthRouteExceptions.find(exc => exc.url.UrlStringFormat() == route.url.UrlStringFormat())
        layer.$chasi = {
            route,
            guarded: unguarded ? false:true
        }
    }

    static setListeners () {
        global.events.listensTo('NewRouterEntry', AuthorizationDriver.SetGuards)
    }

    static init ($app, property) {
        JWTDriver.init(AuthorizationDriver.routes, $app)
        AuthorizationDriver.$app = $app;
        AuthorizationDriver.property = property;
        AuthorizationDriver.setListeners()
        return new AuthorizationDriver();
    }
}
module.exports = AuthorizationDriver;