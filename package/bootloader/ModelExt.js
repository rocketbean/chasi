const Base = require("../base");
const pluralize = require("pluralize")
const mongoose = require("mongoose")
const Model = handle("/package/statics/Models")

class ModelExt extends Base {
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
        modelObject[model.toLowerCase()] = await Model.$container[model].findById(index);
        return modelObject;
    }

    async hasMany (model, col = null) {
        const modelObject = this.toObject(); 
        if(pluralize.isPlural(this.collection.collectionName)) col = pluralize.singular(this.collection.collectionName)
        col += "_id"
        modelObject[pluralize(model.toLowerCase())] = await Model.$container[model].where({[col]: modelObject._id});
        return modelObject;
    }

    install (schema) {
        try {
            let methods = this.methods()
            Object.keys(methods).forEach(m => {
                schema.methods[m] = methods[m]
            })
        } catch(e) {
            console.log(e.message)
        }
    }
}

module.exports = ModelExt;
