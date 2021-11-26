const Provider = handle("/package/statics/Provider");

class StreamEngineServiceProvider extends Provider{
    static async boot() {
        try {
            const StreamEngine = require("../modules/StreamEngine");
            return await StreamEngine.init(
                StreamEngineServiceProvider.$config.StreamEngine
            )
        } catch(e) {
            throw e
        }
    }
}
module.exports = StreamEngineServiceProvider;