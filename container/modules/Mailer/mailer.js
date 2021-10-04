const sgMail = require('@sendgrid/mail')
const config = require('../../../config/Mailer');
const Base = require('../../../package/base');
sgMail.setApiKey(config.authentication.key);

module.exports = class Mailer extends Base{
    constructor () {
        super()
        this.config = config
        this.renders = this.stackDirObject(this.config.emailContainer);
    }

    async send(template, props, title = "email verification") {
        if(!props?.email) throw new error("property parameters must have email property.");
        let view = new this.renders[template](this.config, props);
        return await this.submit(view, props.email, title)
    }

    async submit (view, email, title) {
        try {
            return await sgMail.send({
                to: email,
                from: 'chasi@gmail.com',
                subject: title,
                html: await view.render()
            })
        } catch(e) {
            throw new Error(e.message)
        }

    }
}