const Base = require('../base');
const Models = require('./Models');
const pluralize = require('pluralize');
const socketAdapter = require('../framework/chasi/adapters/SocketAdapters');

module.exports =  class Controller extends Base {

    static $app = {}
    
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

    static $next = {}
    
    get next () {
        return Controller.$next.app;
    }

    get compiler () {
        return Controller.$next.next;
    }

    get $config () {
        return Controller.$config;
    }
    
    get models () {
        return Models.$container
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

    /**
     * binds the controller into a given model
     * used mostly in dynamic routes
     * it will autopopulate 
     * [request.params]
     * @param {model} String
     * @returns {Schma::Model} instance
     */
    model(model) {
        return Models.$container[model]
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

    static bindNextInstance ($next) {
        Controller.$next = $next;
    }
}
