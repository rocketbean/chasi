const User = require("../Models/User");
const adapter = require("../../package/framework/chasi/adapters/adapters")
const mongoose = require("mongoose")
const ObjectId = mongoose.Types.ObjectId; 
const Controller = require("../../package/statics/Controller");

class UserController extends Controller {

    static unguarded = ['name', 'alias', 'avatar'];
    /**
     * Access to Chasi Service Container
     * via Adapter Service
     * @param {Adapter}
     * @return {Mailer} 
     */
    get mailer () {

        return adapter.getService("Mailer")
    }

    /**
     * @param {*} req 
     * @returns {User, token[String]}
     */
    async login (req) {
        
        try {
            const user = await User.findByCredentials(req.body.email, req.body.password);
            await user.populate('notifications').execPopulate()
            const token = await user.generateAuthToken('api');
            return {user, token}
        } catch(e) {
            throw {
                status: 400,
                message: e.message
            }
        }
    }
    
    /**
     * @param {Body [UserData] } req 
     * @returns {User, token[String]}
     */
    async register (req) {

        const user = await new User(req.body).save()
        const token = await user.generateAuthToken('api')
        return {user, token};
    }

    /**
     * @param { File [BigInt64ArrayConstructor] } req[Binary]
     * @returns { fileObject }
     */
    async avatar (req) {

        let sec = Object.keys(req.body.files).map(f => f);
        return {filename: req.body.files[sec[1]].public}
    }

    async dashboard (req) {
        return true;
    }

    async index (req) {
        return true;
    }

    async post (req) {
        return "success";
    }
}

module.exports = new UserController();