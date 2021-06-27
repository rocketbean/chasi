const route = require("../../../package/framework/chasi/Routing/Route")

module.exports = function() {
    route.post("login", "UserController@login");
    route.group({prefix: "test"}, (() => {
        route.post("index", "TestController@index");
    }))
}
