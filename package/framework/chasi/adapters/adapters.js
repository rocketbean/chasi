import {Base} from "../../../base.js";

export default class Adapter extends Base {
    static services = {}
    constructor () {
        super()
    }

    static getService (service) {
        return Adapter.services[service]
    }
}
