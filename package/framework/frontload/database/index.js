const mongoose = require("mongoose")
const __v = require("validator")

class DBWrapper {
    static global;
    static property;
    constructor () {
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
        this.connection = await mongoose.connect(this.hostat, this.property.connection.options).catch(e => {
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