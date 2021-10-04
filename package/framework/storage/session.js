const Base = require("../../base");

class SessionStorage extends Base{
    /**
     * Boot FilePath
     * 
     */
    static provider = '/container/services/SessionStorageServiceProvider';

    /**
     * Object storage
     */
    static ClassMap = {};

    static storage = {};

    static constructors = {};


    static create (session) {
        if(SessionStorage.ClassMap.hasOwnProperty[session.name]) {
            return SessionStorage.ClassMap[session.name];
        } else {
            SessionStorage.ClassMap[session.name] = session;
        }
        SessionStorage.setConstructorMapping(session);
        SessionStorage.storageRegistry(session.name)
        return SessionStorage.ClassMap[session.name];
    }

    static storageRegistry (sessionName) {
        if(!SessionStorage.storage.hasOwnProperty(sessionName)) SessionStorage.storage[sessionName] = [];
    }

    static setConstructorMapping (session) {
        if(!session?.constructors) throw new Error(`Session Object must have Constructive(constructors) property :: ${session.name}`)
        session.constructors.forEach(c => {
            if(this.constructors.hasOwnProperty(c)) throw new Error(`${c} has already been registered to [${this.constructors[c]}]`)
            this.constructors[c] = session.name;
        })
    }


    static mapConstructor(obj) {
        try {
            if(!this.constructors.hasOwnProperty(obj?.constructor?.modelName)) throw new Error(`Session Storage doesn't have [${obj.constructor.modelName}] value set as constructor`)
            return this.constructors[obj.constructor.modelName]
        } catch (e) {
            // console.log(e)
        }

    }

    static fetch (obj) {
        try {
            let cn = SessionStorage.mapConstructor(obj);
            let q = SessionStorage.storage[cn].find(session => session.session_id.toString() === obj._id.toString());
            if(!q) SessionStorage.add(obj)
            return SessionStorage.storage[cn].find(session => session.session_id.toString() === obj._id.toString());
        } catch(e) {

        }

    }

    static find (session) {
        // find session in
        // session storage
    }

    static CLEARSESSION () {
        this.storage = {}
    }

    static add (obj) {
        try {
            let cn = SessionStorage.mapConstructor(obj);
            this.storage[cn].push(new SessionStorage.ClassMap[cn](obj));
        } catch(e) {

        } 

    }

    static debug () {
        return SessionStorage.storage;
    }

    static init () {
        let install = SessionStorage.staticAssignFile(SessionStorage.provider).boot()
        Object.keys(install).forEach(pkg => {
            SessionStorage.create(install[pkg])
        });
    }


    
}
module.exports = SessionStorage;