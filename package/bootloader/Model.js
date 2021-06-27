const Base = require("../base");
const pluralize = require("pluralize")

class Model extends Base{
    static modelPath = 'container/Models/';
    static models = {};
    static container;

    constructor () {
        super();
    }

    methods () {
        return {
            has: this.has,
            hasMany: this.hasMany,
        }
    }
    
    async has (model, col = null) {
        if(col === null) col = model.toLowerCase() + "_id";
        let index = this[col]
	    const modelObject = this.toObject(); 
        modelObject[model.toLowerCase()] = await Model.models[model].findById(index);
        return modelObject;
    }

    async hasMany (model, col = null) {
        const modelObject = this.toObject(); 
        if(pluralize.isPlural(this.collection.collectionName)) col = pluralize.singular(this.collection.collectionName)
        col += "_id"
        console.log(col)
        modelObject[pluralize(model.toLowerCase())] = await Model.models[model].where({[col]: modelObject._id});
        return modelObject;
    }

    registerModel (path) {
        if(!path.includes(".js")) path = path + ".js"
        Model.models[path.replace(".js", "")] = this.assignFile(Model.modelPath + path)
    }

    static install (schema, path) {
        try {
            if(!schema.methods) throw new Error('invalid Model Object error');
            let methods = Model.container.methods();
            Object.keys(methods).forEach(m => {
                schema.methods[m] = methods[m]
            })
        } catch(e) {
            Model.container.exception(e.message, 1)
        }

    }

    static getModels () {
        Model.models = Model.container.stackDirObject(Model.modelPath)
    }

    static async ready () {
        Model.container = await new Model();
        Model.getModels();
        return Model.container;
    }
}

module.exports = Model;
