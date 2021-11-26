const AppSession = require("../modules/AppSession");
const Provider = handle("/package/statics/Provider");

class SessionStorageServiceProvider extends Provider {
    
    static async boot () {
        return {
            AppSession
        }
    }
}

module.exports = SessionStorageServiceProvider