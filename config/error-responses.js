module.exports = {
    MongoError: {
        code: {
            11000: "Oops! the ${field} you've entered is already on our records! please choose a different one."
        }
    },
    404: "we cannot find the page you we're looking for",
    400: "Oops! we got confused with the request. please try it again.",
    _default: "we're having trouble processing your request, please try again later!",
    _config: {
        fieldWrapper: '/\${([^)]+)\}/'
    }
}