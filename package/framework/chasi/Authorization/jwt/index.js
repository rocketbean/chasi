const jwt = require("jsonwebtoken");
const SessionStorage = require("../../../storage/session");
const Gateway = require('../index')

class JWTDriver {

    static TokenExceptions = [];
    static $instances = [];
    static $app = {};
    constructor (prop, router) {
        this.router = router
        this.model = prop.model;
        this.key = prop.key;
        this.property = prop;
        this.addTokenExceptions(prop.AuthRouteExceptions);
    }

    addTokenExceptions (route) {
        if(Array.isArray(route)) {
            route.map(r => {
                JWTDriver.TokenExceptions.push(r)
            })
        } else {
            JWTDriver.TokenExceptions.push(route)
        }
    }

    
    setAuthorization () {
        return (async (req, res, next) => {
            var gateway = true;
            const url = req.originalUrl.split('?')[0] // Routes with query
            const layer = req.app._router.stack.find(layer => {
                return layer.regexp.exec(url) && layer.route
            })
            let target = JWTDriver.$routes[layer?.route?.app_session_id]?.target
            try {
                JWTDriver.TokenExceptions.map(t => {
                    if(t.url === req.path && t.m === req.method)    
                        gateway = false
                })
                if(!(target?.property?.enabled)) gateway = false
                if(gateway) {
                    const _t = req.header("Authorization")?.replace("Bearer ", "")
                    const _d = jwt.verify(_t, target?.key)
                    const user = await target?.model.findOne({_id:_d._id})
                    let $session = SessionStorage.fetch(user);
                    if(!user) throw new Error()
                    req.auth = {user, _t, $session};
                }
                next()
            } catch (e) {
                if(!(e instanceof TypeError)) res.status(401).send("failed authenticating token")
            }
        })
    }

    static init($routes, $app) {
        JWTDriver.$routes = $routes;
        JWTDriver.$app = $app;
    }

}
module.exports = JWTDriver;