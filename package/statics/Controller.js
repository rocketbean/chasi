const Base = require('../base')

module.exports =  class Controller extends Base {
    static $app = {}
    static $models = {}
    static $bindMap = {
        'notification-entry': 'entry',
        'notification-dispatcher': 'dispatcher',
    }
    get models () {
        return Controller.$models
    }

    model(model) {
        return Controller.$models[model]
    }


    static init(property) {
        Controller.$config = property.app
        Controller.assignModels(Controller.$config.modelsDir);
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
