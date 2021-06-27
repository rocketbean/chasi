const mongoose = require("mongoose")
const __v = require("validator")
const bc = require("bcryptjs")
const jwt = require("jsonwebtoken")

let UserSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		trim: true
	},
	alias: {
		type: String,
		required: true,
		trim: true,
		unique: true
	},
	email: {
		type: String,
		unique: true,
		lowercase: true,
		validate (v) {
			if(!__v.isEmail(v)) {
				throw new Error("email is not valid")
			}
		},	
		required: true
	},
	password:{
		type: String,
		trim: true,
		minlength: 6,
		validate(v) {
			if(v.toLowerCase().includes("password")) 
				throw new Error("entry with the word 'password' cannot be used. ")
		}
	},
	avatar: {
		type: String,
		required: true,
	},
	socket: {
		type: String,
		trim: true,
		default: "na"
	},
	accountStatus: {
		default: 0,
		type: Number,
	},
	peerCounts: {
		default: 0,
		type: Number,
	},
	settings: {
		type: {},
		default: {
			tutorials: true
		}
	},
	connections: [{ type: mongoose.Schema.Types.ObjectId, ref: 'room' }],
	communities: [{ type: mongoose.Schema.Types.ObjectId, ref: 'community' }],
	tokens: [{
		token: {
			type: String,
			required: true
		}
	}],
}, {
	timestamps: true
})

UserSchema.virtual('chambers', {
	ref: 'room',
	localField: '_id',
	foreignField: 'owner'
})

UserSchema.virtual('notifications', {
	ref: 'notification',
	localField: '_id',
	foreignField: 'owner'
})


UserSchema.methods.toJSON = function () {
	const user = this
	const userObject = user.toObject()
	delete userObject.password
	delete userObject.tokens
	delete userObject.communities
	delete userObject.connections
	userObject.notifications = user.notifications
	return userObject;
}

UserSchema.methods.generateAuthToken = async function () {
	const user = this
	return await jwt.sign({_id: user._id.toString()}, "test")
}

UserSchema.statics.findByCredentials = async (email, pass) => {
	const user = await User.findOne({email})
	if(!user)
		throw new Error("email can't be found")

	const isMatch = await bc.compare(pass, user.password)
	if(!isMatch)
		throw new Error("wrong credentials have been supplied")
	user.appSession = user.email
	return user
}
	// Hashing Passwords
UserSchema.pre('save', async function(next) {
	const user = this
	if(user.isModified("password")) {
		user.password = await bc.hash(user.password, 8)
	}
	next()
})

const User = mongoose.model('user', UserSchema)

module.exports = User