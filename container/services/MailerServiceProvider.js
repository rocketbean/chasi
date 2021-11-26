const Mailer = require("../modules/Mailer/mailer");
const Provider = handle("/package/statics/Provider");

class MailerServiceProvider extends Provider{
    static async boot() {
        // return new Mailer()
    }
}
module.exports = MailerServiceProvider;