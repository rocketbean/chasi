const Router = require("../../package/framework/chasi/Routing/Router");

class RouterServiceProvider {
    static boot () {
        return [
            new Router({
                name            : 'api',
                prefix          : '/api',
                namespace       : '/http/api.js',
                ControllerDir   : 'controllers/',
                middleware      : [],
                AuthRouteExceptions   : []
            }),
            new Router({
                name            : 'chasi',
                prefix          : '/chasi',
                namespace       : '/http/chasi.js',
                ControllerDir   : 'controllers/',
                middleware      : [],
                AuthRouteExceptions   : []
            })
        ]
    }
}

module.exports = RouterServiceProvider