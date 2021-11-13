const ErrorHandler = require("./framework/error/ErrorHandler");
const _p = require('path');
const _fs = require('fs');

class Base extends ErrorHandler {
    static ReadCon = [];
    static _g;
    static property;
    static $server;
    static $app;

    constructor () {
        super();
    }
    /**
     * return Object Properties
     * @param {Object} obj 
     * [shorthand]
     */
    getObjectProperties (obj) {
        return Object.keys(obj);
    }

    /**
     * Removes from array list
     * @param {array} list 
     * @param {array} haystack
     * @return {object}
     * shorthand 
     */
    excludeFromProperty (list, haystack) {
        let args = {};
        this.getObjectProperties(haystack).forEach(prop => {
            if(!list.includes(prop)) args[prop] = haystack[prop]
        });
        return args;
    }

    /**
     * returns selected key from object
     * helps on selecting modes...
     * @param {Array} arr 
     * @param {String} key 
     * shorthand
     */
    keySelector(arr, key) {
        return arr[key];
    }

    /**
     * Get file Via props
     * at basepath [./config]
     */
    requireFiles (alias, path) {
        var normalizedPath = Base._g.path.join(basepath, path);
        Base.bootfiles = Base._g.fs.readdirSync(normalizedPath).map(fn => {
            return {[alias]: normalizedPath + "/" + fn}
        }).map(Base.readFile.bind(Base));
    }

    /**
     * Get file Via props
     * at basepath [./config]
     */
    stackDir (path) {
        var normalizedPath = Base._g.path.join(basepath, path);
        return  Base._g.fs.readdirSync(normalizedPath).map(fn => {
            if(fn.includes(".js")) {
                return this.assignFile(`${path}${fn}`) 
            }
        });
    }

    /**
     * Get file Via props
     * at basepath [./config]
     */
    stackDirObject (path) {
        var collection = {};
        var normalizedPath = _p.join(basepath, path);
        _fs.readdirSync(normalizedPath).map(fn => {
            collection[fn.replace(_p.extname(fn), "")] = this.assignFile(`${path}${fn}`) 
        });
        return collection;
    }

    /**
     * read and require the file 
     * saves on static ReadCon [ReadContainer]
     * @param {registry} file 
     */
    readFile (alias, path) {
        Base.ReadCon[alias] = require(Base._g.path.join(basepath, path));
    }

    /**
     * returns the buffer file
     * @param {path} file 
     */
    assignFile (path) {
        try {
            return require(_p.join(basepath, path));
        } catch (e) {
            return new Error (e.message + `\nFileAssignment::error at path ${path}`);
        }
    }

    /** STATIC
     * returns the buffer file
     * @param {path} file 
     */
    static staticAssignFile (path) {
        try {
            return require(Base._g.path.join(basepath, path));
        } catch(e) {
            throw new Error(e.message, `on path: ${path}`)
        }
    }

    /** STATIC
     * stacks the file in [dir]
     * @param {path} file 
     */
    static staticStackDir (path) {
        var normalizedPath = Base._g.path.join(basepath, path);
        return Base._g.fs.readdirSync(normalizedPath).map(fn => {
            return Base.staticAssignFile(`${path}${fn}`) 
        });

    }
    /**
     * removes any special character from string
     * @param {str} str 
     */
    cleanString(param, exception = []) {
        if(Array.isArray(param)) {
            return param.map(str => this.stringSanitizer(str, exception));
        } else {
            return this.stringSanitizer(param,exception)
        }
    }

    stringSanitizer(str, exception) {
        let invalid = `[&\/\\#,+()$~%.'":*?!<>{}]`
        exception.map(e => {
            invalid = invalid.replace(e, '');
        })
        return str.replace(eval(`/${invalid}/g`), '');
    }

    /**
     * remove whitespaces on string
     * @param {str} str 
     */
    removeSpaces(param) {
        if(Array.isArray(param)) {
            return param.map(str => str.replace(/\s/g, '') )
        } else {
            return param.replace(/\s/g, '');
        }
    }

    static throughDirs (dir) {
        let files = []
        function ThroughDirectory (Directory) {
            _fs.readdirSync(Directory).forEach(File => {
                const Absolute = _p.join(Directory, File);
                if (_fs.statSync(Absolute).isDirectory()) return ThroughDirectory(Absolute);
                else return files.push({[File]: Absolute});
            });
        }
        let dirs = ThroughDirectory(dir);
        return files;
    }

    static install (_g, property, server, app) {
        Base._g = _g;
        Base.property = property;
        Base.$server = server;
        Base.$app = app;
    }
}

module.exports = Base;