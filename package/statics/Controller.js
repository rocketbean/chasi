const Base = require('../base')
const pluralize = require('pluralize')

module.exports =  class Controller extends Base {
    static $app = {}
    static $models = {}
    static $services = {}
    static $packages = {}
    static $bindMap = {
        'notification-entry': 'entry',
        'notification-dispatcher': 'dispatcher',
    }
    get models () {
        return Controller.$models
    }

    get packages () {
        return Controller.$packages
    }

    get services () {
        return Controller.$services
    }

    model(model) {
        return Controller.$models[model]
    }


    static init(property, packages) {
        Controller.$config = property.app
        Controller.$packages = packages.installedPackages;
        Controller.assignModels(Controller.$config.modelsDir);
    }

    static installServices($services) {
        Controller.$services = $services;
    }

    static assignModels(directory) {
        try {
            directory.forEach( dir => {
                var buff = Controller.staticStackDir(`${dir}`);
                buff.map(filedir => {
                    if(filedir instanceof Error) throw new Error(filedir.message);
                    let key = Reflect.construct(filedir, []).constructor.modelName
                    if(Controller.$bindMap[key]) key = Controller.$bindMap[key]
                    Controller.$models[key] = filedir
                })
            })
        } catch(e) {
            console.log(e)
        }
    }
}
