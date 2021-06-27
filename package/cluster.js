module.exports = (baseClass, ...mixins) => {
    class base extends baseClass {
        constructor (...args) {
            super(...args);
            mixins.forEach((mixin) => {
                duplicateProperties(this,(new mixin));
            });
        }
    }
    let duplicateProperties = (target, source) => { 
        Object.getOwnPropertyNames(source)
            .concat(Object.getOwnPropertySymbols(source))
            .forEach((prop) => {
                if (!prop.match(/^(?:constructor|prototype|arguments|caller|name|bind|call|apply|toString|length)$/))
                    Object.defineProperty(target, prop, Object.getOwnPropertyDescriptor(source, prop));
            })
    }
    mixins.forEach((mixin) => { 
        duplicateProperties(base.prototype, mixin.prototype);
        duplicateProperties(base, mixin);
    });
    return base;
}

