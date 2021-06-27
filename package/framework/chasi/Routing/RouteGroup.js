
class RouteGroup {
    static groups = [];
    constructor (stack) {
        this.group = stack.group;
        this.middleware = []
        this.prefix = []
        this.pushMiddleware(stack.middleware)
        this.pushPrefix(stack.prefix)
    }

    consume (route) {
        this.pushMiddleware(route.middleware);
    }

    join (route) {

    }

    pushMiddleware(middleware) {
        if(Array.isArray(middleware)) middleware.forEach(m => this.injectMiddleware(m));
        else this.injectMiddleware(middleware);
    }

    injectMiddleware (middleware) {
        if(!this.middleware.includes(middleware)) {
            if(middleware) this.middleware.push(middleware)
        }
    }


    pushPrefix(prefix) {
        if(Array.isArray(prefix)) prefix.forEach(p => this.appendPrefix(p));
        else this.appendPrefix(prefix);
    }

    appendPrefix (prefix) {
        if(!this.prefix.includes(prefix)) {
            if(prefix !== '/') prefix = '/'.concat(prefix);
            this.prefix.push(prefix)
        }
    }
    // implimentGuardMiddleware () {
    //     this.routes.forEach(route => {
    //         route.inject(this.middleware, this.group)
    //         route.enlistRoute();
    //     })
    // }

    static register (stack) {
        let index = RouteGroup.groups.find(g => g.group === stack.group);
        if(!index) {
            index = new RouteGroup(stack)
            RouteGroup.groups.push(index)
        } else {
            index.pushMiddleware(stack.middleware)
            index.pushPrefix(stack.middleware)
        }
        return index;
    }

    static validateStr (str) {
        if(str === undefined) return '/'
        if(str[0] !== '/') {
            str = `/${str}`;
        }
        return str;
    }
}

module.exports = RouteGroup;