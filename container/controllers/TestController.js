const SessionStorage = require("../../package/framework/storage/session");
const adapter = require("../../package/framework/chasi/adapters/adapters")
const Controller = require("../../package/statics/Controller");

class TestController extends Controller {

    async index (req) {
        return "success"
    }

}

module.exports = new TestController();