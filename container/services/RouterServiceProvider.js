const Router = require("../../package/framework/chasi/Routing/Router");
const Provider = handle("/package/statics/Provider");

class RouterServiceProvider extends Provider{
    static async boot () {
        return [
            new Router({
                name            : 'api',
                prefix          : '/api',
                namespace       : '/http/api.js',
                ControllerDir   : ['controllers/'],
                middleware      : [],
                AuthRouteExceptions   : []
            }),

            new Router({
                name            : 'chasi',
                prefix          : '/chasi',
                namespace       : '/http/chasi.js',
                ControllerDir   : ['controllers/'],
                middleware      : [],
                AuthRouteExceptions   : []
            }),

            new Router({
                name            : 'web',
                prefix          : '/',
                namespace       : '/http/web.js',
                ControllerDir   : ['controllers/'],
                middleware      : [],
                AuthRouteExceptions   : []
            })
        ]
    }
}

module.exports = RouterServiceProvider