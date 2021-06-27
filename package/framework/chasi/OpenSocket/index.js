const Base = require("../../../base");
const { Error } = require("mongoose");


class OpenSocket extends Base{
    /**
     * static *properties
     * [Required property]
     */
    static requires = ['name', 'namespace'];

    /**
     * static *guards
     * [attaches middleware properties]
     */
    static guards = []
    static _basepath = '/routes/channels';

    static $io;
    static $app;
    static $server;
    
    constructor (property) {
        super();
        this.validateProperties(property);
        this.name = property.name;
        this.network = {};
        this.namespace = this.setNameSpace(property.namespace);
        this.readNamespace();
        this.createSocket();
    }

    setNameSpace (namespace) {
        if(namespace[0] !== '/') namespace = '/'.concat(namespace);
        return this.removeSpaces( this.cleanString(namespace,['/', '.']));
    }


    validateProperties (property) {
        let mp = []
        OpenSocket.requires.map(r => {
            if(!Object.keys(property).includes(r)) mp.push(r)
        })
        if(mp.length > 0) this.exception(`missing required field ${[...mp]}`, 0)
    }

    createSocket() {
        let io = OpenSocket.$io
        OpenSocket.$io.on("connection", (socket ) => {
            try {
                this.network[this.namespace](socket, io)
            } catch(e) {
                this.exception(`OpenSocketError:: ${e.message}`, 0)
            }
        });

    }

    readNamespace () {
        try {
            let _p = '/container' + OpenSocket._basepath + this.namespace
            this.network[this.namespace] = this.assignFile(_p);
        } catch(e) {
            this.exception(`OpenSocketError:: ${e.message}`, 1)
        }

    }

    static fetchMiddlewares () {
        let mw = OpenSocket.$property.server.socketMiddlewares
        if(Array.isArray(mw)) mw.map((m, i) => OpenSocket.guards.push(OpenSocket.staticAssignFile('/container' + m)));
        else OpenSocket.guards.push(this.staticAssignFile('/container' + mw))
        OpenSocket.guards.map(g => OpenSocket.$io.use(g));
    }

    static init ($app,$property, $io) {
        OpenSocket.$app = $app;
        OpenSocket.$property = $property;
        OpenSocket.$io = $io;
        OpenSocket.fetchMiddlewares();
    }
}

module.exports = OpenSocket;