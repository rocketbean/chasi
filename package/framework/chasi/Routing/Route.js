import {RouteRegistry} from "./RouteRegistry.js";
import {ErrorHandler} from "../../error/ErrorHandler.js";
import {RouteGroup} from "./RouteGroup.js";
import mongoose from "mongoose";

const ObjectId = mongoose.Types.ObjectId; 

export class Route extends ErrorHandler{
    static prefer;
    static groups = [];
    static prefixes = [];
    static middlewares = [];
    constructor (property) {
        super();
        this.endpoint = property.endpoint
        this.controller = this.locateController(property.controller)
        this.method = property.method
        this.options = property.options
        this.callToPrefix = 0;
        this.prefixes = [];
        this.middlewares = [];
        this.groups = [];
        this.setRouteProperties()
    }

    setId(id) {
        this.id = id;
    }

    setRouteProperties() { 
        Route.groups.forEach(group => {
            this.prefixes.push(...group.prefix);
            this.middleware(group.middleware);
            this.groups.push(group);
        })
    }

    locateController(path) {
        let constructor = path.split("@")[0];
        let method  = path.split("@")[1];  
        return { 
            constructor,
            method 
        } 
    }

    maskFn() {
        return;
    }

    prefix (pre, id) {
        if(Array.isArray(pre)) {
            pre.map(pf => this.prefixes.unshift(pf));
        } else {
            this.prefixes.unshift(pre);
        }
        return this;
    }

    middleware (middleware) {
        if(Array.isArray(middleware)) middleware.map(mw => this.pushMiddleware(mw))
        else this.pushMiddleware(middleware)

        return this;
    }

    pushMiddleware (middleware) {
        if(!this.middlewares.includes(middleware)) {
            if(middleware) this.middlewares.push(middleware)
        }
    }
    
    static post(endpoint, controller,options = {}) {
        let RouteRegistry = new Route({
            method: 'post',
            controller,
            endpoint,
            options,
        })
        Route.prefer(RouteRegistry);
        return RouteRegistry;

    }

    static get(endpoint, controller, options = {}) {
        let RouteRegistry = new Route({
            method: 'get',
            controller,
            endpoint,
            options,
        })
        Route.prefer(RouteRegistry);
        return RouteRegistry;
    }

    static update(endpoint, controller, options = {}) {
        let RouteRegistry = new Route({
            method: 'update',
            controller,
            endpoint,
            options,
        })
        Route.prefer(RouteRegistry);
        return RouteRegistry;
    }

    static delete(endpoint, controller, options = {}) {
        let RouteRegistry = new Route({
            method: 'delete',
            controller,
            endpoint,
            options,
        })
        Route.prefer(RouteRegistry);
        return RouteRegistry;
    }

    static patch(endpoint, controller, options = {}) {
        let RouteRegistry = new Route({
            method: 'patch',
            controller,
            endpoint,
            options,
        })
        Route.prefer(RouteRegistry);
        return RouteRegistry;
    }

    static group(stack, fn) {
        let track = {
            groups: '',
            middlewares: [],
            prefixes: ''
        };
        (() => {
            Route.#stackGroup(stack);
            fn();
            Route.#removeGroupStack(stack);
            return;
        })();
    }


    static #removeGroupStack(stack) {
        Route.groups = Route.groups.filter(_group => _group.group != stack.group);
    }


    static #stackGroup(stack) {
        if(!stack.hasOwnProperty('group')) stack.group = ObjectId().toString()
        let _group = RouteGroup.register(stack)
        Route.groups.push(_group);
    }
}