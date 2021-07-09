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

    async send(render, props) {
        let baselink = this.config.authentication.baseUrl + this.config.authentication.verificationUrl + `/${props.verification._id}`
        let view = new this.renders[render](baselink);
        return await this.submit(view, props.user)
    }

    async submit (view, user, title = "email verification") {
        try {
            return await sgMail.send({
                to: user.email,
                from: 'youremail@email.com',
                subject: title,
                html: await view.render()
            })
        } catch(e) {
            throw new Error(e.message)
        }

    }
}