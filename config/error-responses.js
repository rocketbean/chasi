module.exports = {
    MongoError: {
        code: {
            11000: "Oops! the ${field} you've entered is already on our records! please choose a different one."
        }
    },
    _default: "we're having trouble processing your request, please try again later!",
    _config: {
        fieldWrapper: '/\${([^)]+)\}/'
    }
}