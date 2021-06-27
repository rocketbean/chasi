const Base = require("../../../base");

class Adapter extends Base {
    static services = {}
    constructor () {
        super()
    }

    static getService (service) {
        return Adapter.services[service]
    }
}

module.exports = Adapter