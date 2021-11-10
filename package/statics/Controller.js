const Base = require('../base');
const Model = require('./Models');
const pluralize = require('pluralize');
const socketAdapter = require('../framework/chasi/adapters/SocketAdapters');

module.exports =  class Controller extends Base {

    static $app = {}
    
    /**
     * [Mongoose::Model]
     * container of models
     */
    static $models = {}

    /**
     * [Chasi::Services]
     * container of services registered 
     * to $Chasi service container
     */
    static $services = {}

    /**
     * [Chasi::Package]
     * $chasi package is an internal
     * package or services 
     * initiated by chasi instance
     */
    static $packages = {}

    /**
     * [Chasi::View]
     * $chasi ViewController instance
     * initiated by chasi instance
     */
    static $view = {}
    
    get compiler () {
        return Controller.$view
    }

    get $config () {
        return Controller.$config;
    }
    
    get models () {
        return Model.$models
    }

    get packages () {
        return Controller.$packages
    }

    get $io () {
        return Controller.$io;
    }

    get $observer () {
        return Controller.$observer;
    }

    get services () {
        return Controller.$services
    }

    model(model) {
        return Controller.$models[model]
    }


    static init(property, packages, observer) {
        Controller.$io = socketAdapter.$io
        Controller.$config = property
        Controller.$packages = packages.installedPackages;
        Controller.$observer = observer.events;
    }

    static installServices($services) {
        Controller.$services = $services;
    }

    static bindViewInstance ($view) {
        Controller.$view = $view;
    }

}
