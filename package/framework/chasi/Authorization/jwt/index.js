const jwt = require("jsonwebtoken");
const SessionStorage = require("../../../storage/session");
const Gateway = require('../index')
const ErrorHandler = require("../../../error/ErrorHandler")
const Adapter = require("../../../../statics/Adapter")
const Models = handle("/package/statics/Models")

class JWTDriver extends ErrorHandler {

    static TokenExceptions = [];
    static $instances = [];
    static $app = {};

    constructor (prop, router) {
        super();
        this.router = router
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
            let layer = JWTDriver.$app.routeLayer(req.originalUrl.split('?')[0], req.method)
            var gateway = layer?.$chasi?.guarded;
            if(!(layer?.$chasi)) {
                this.exception(`${req.originalUrl} \n uknown route layer`,1) 
                next()
                return;
            }
            
            let target = layer.$chasi.route.target
            let model = Models.$container[target.property.model]
            try {
                if(!(target?.property?.enabled)) gateway = false
                if(gateway) {
                    const _t = req.header("Authorization")?.replace("Bearer ", "")
                    const _d = jwt.verify(_t, target?.key)
                    const user = await model.findOne({_id:_d._id})
                    let $session = false;
                    if(target?.property?.sessions) $session = SessionStorage?.fetch(user);
                    if(!user) throw new Error()
                    req.auth = {user, _t, $session};
                }
                next()
            } catch (e) {
                if(e.message.includes("invalid signature") || e.message.includes("jwt") ) {
                    this.exception(e.message, 1, "danger")
                    res.status(401).send("failed authenticating token")
                }
                this.exception(`JWTCatch::error ${e.message}`, 0, "danger")
            }
        })
    }

    static init($routes, $app) {
        JWTDriver.$routes = $routes;
        JWTDriver.$app = $app;
    }

}
module.exports = JWTDriver;