const mongoose = require("mongoose")
const __v = require("validator")
const ErrorHandler= require('../../error/ErrorHandler');

class DBWrapper extends ErrorHandler{
    static global;
    static property;
    constructor () {
        super()
        this.property = DBWrapper.property.database;
        this.secureBoot = DBWrapper.property.database.bootWithDB;
        this.hostat = this.property.connection.url+this.property.connection.db
        if(this.property.connection.params) {
            this.hostat += this.property.connection.params
        }
        this.connection = null
    }

    middleware () {
        return true;
    }

    async init() {
        if(this.middleware()) {
            return this;
        } else {
            throw new Error('ERROR: DBWrapper process did not pass the middleware');
        }
    }

    async connect() {
        this.connection = await mongoose.connect(this.hostat, this.property.connection.options).then(con => {
            let matched = this.hostat.match(/\/\/(.*?)\//g)[0]
            let starlength = matched.length
            let stars = "*".repeat(starlength/2)
            let _at = matched.indexOf("@")
            stars = stars.split("");
            stars[_at/2] = matched[_at/2];
            stars[_at/2-1] = matched[_at/2-1];
            stars[_at/2+1] = matched[_at/2+1];
            stars[0] = matched[0];
            stars[starlength/2-1] = matched[starlength/2-1];
            stars =  stars.join("")
            logger.msg(`DB::${this.hostat.replace(/\/\/(.*?)\//g, stars)}`, 0, "subsystem")
        }).catch(e => {
            if(this.secureBoot)  throw new Error('ERROR: failed booting up database');
        })
        return this.connection
    }

    static bootstrap (global, property) {
        DBWrapper.global = global
        DBWrapper.property = property
    }
}
module.exports = (function (args) {
    DBWrapper.bootstrap(args.global, args.property);
    return new DBWrapper()
})