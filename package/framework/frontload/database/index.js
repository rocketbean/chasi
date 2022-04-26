const mongoose = require("mongoose")
const __v = require("validator")
const ErrorHandler = require('../../error/ErrorHandler');
const Exception = require('../../error/Exception');

class DBWrapper extends ErrorHandler{
    static global;
    static property;
    static requireConnectionProp = ['url', 'db']
    constructor () {
        super()
        this.beforeInit()
        this.property = DBWrapper.property.database;
        this.secureBoot = DBWrapper.property.database.bootWithDB;
        this.hostat = this.property.connection.url+this.property.connection.db
        if(this.property.connection.params) {
            this.hostat += this.property.connection.params
        }
        this.connection = null
        this.connections = {}
        this.failedConnections = {}
    }

    middleware () {
        return true;
    }

    parseRemoteString(connection) {
        try {
            let ConString = connection.url+connection.db
            if(connection.params) {
                ConString += connection.params
            }
            return ConString;
        } catch(e) {
            throw new Error(e.message, "errstring")
        }

    }

    async init() {
        if(this.middleware()) {
            return this;
        } else {
            throw new Error('ERROR: DBWrapper process did not pass the middleware');
        }
    }

    hideStrings (conString) {
        let matched = conString.match(/\/\/(.*?)\//g)[0]
        let starlength = matched.length
        let stars = "*".repeat(starlength/2)
        let _at = matched.indexOf("@")
        stars = stars.split("");
        stars[_at/2] = matched[_at/2];
        stars[_at/2-1] = matched[_at/2-1];
        stars[_at/2+1] = matched[_at/2+1];
        stars[0] = matched[0];
        stars[starlength/2-1] = matched[starlength/2-1];
        return stars.join("")
    }

    async connect(connection, instance) {
        let conString = this.parseRemoteString(connection)
        try {
            return await mongoose.createConnection(conString, connection.options).then((con, e) => {
                let stars =  this.hideStrings(conString)
                logger.msg(`  ${instance.toUpperCase()}::${conString.replace(/\/\/(.*?)\//g, stars)}`, 0, "light")
                return con
            }).catch(e => {
                if(this.secureBoot)  throw new Error(`ERROR: failed booting up database[${instance}]`);
                throw new Error(`${connection} `)
            })
        } catch(e) {
            let stars =  this.hideStrings(conString)
            logger.msg(`  ${instance.toUpperCase()}::${conString.replace(/\/\/(.*?)\//g, stars)}`, 0, "negative")
            if(this.secureBoot)  throw new Error(`DBConnError:: ${instance}`);
            this.exception(`DBConnectionWarning::Failed connecting to [${instance}]`)
            return false
        }

    }

    async connectAll() {
        await Promise.all( Object.keys(this.property.connections).map( async connection => {
            let con = await this.connect(this.property.connections[connection], connection)
            if(con) this.connections[connection] = con
            else this.failedConnections[connection] = con
        }))
        return this.connections

    }

    static bootstrap (global, property) {
        DBWrapper.global = global
        DBWrapper.property = property
    }

    beforeInit() {
        let connections = DBWrapper.property.database.connections
        Object.keys(connections).forEach(con => {
            DBWrapper.requireConnectionProp.forEach(prop => {
                if(connections[con][prop] == undefined || connections[con][prop] == null) {
                    this.exception(`${con}::${prop} is not defined`, 0, "DBWrapper::MissingPropertyError")
                }
            })
        })
    }
}
module.exports = (function (args) {
        DBWrapper.bootstrap(args.global, args.property);
        return new DBWrapper()

})