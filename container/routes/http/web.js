const route = require("../../../package/framework/chasi/Routing/Route")

module.exports = function() {

    /* * * * * * * * * *  Route Endpoint Registry * * * * * * *
    * this registry will serve as the routing container, 
    * please make sure that this is registered in 
    * [container/services/RouterServiceProvider]
    * also check [config/authentication.js] ,
    * by default, API's that is registered through auth config, 
    * will be protected by JWT unless registered in 
    * [AuthRouteExceptions] array option.
    */
    
    route.get("/", "ChasiController@index");
    route.get("/welcome/:name", "ChasiController@welcome");
    
    route.group({prefix: "stream"}, (() => {
        route.group({prefix: "channel"}, (() => {
            route.get("/list", "StreamController@list");
            route.post("create", "StreamController@create");

            route.group({prefix: ":channel"}, (() => {
                route.post("rtp", "ChannelController@getRtpCapability");
                route.post(":client/join", "ChannelController@join");
            }));
        }));
        route.group({prefix: "client"}, (() => {
            route.get('/list', "StreamController@clientList");
            route.post('create', "StreamController@client");
        }));

        route.group({prefix: 'connection'}, (() => {
            
        }));
    }));

}
