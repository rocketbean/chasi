module.exports = class Container {

    /* * * * * * *
     * channels
     *-----------
     * Channel Container
     */
     static channels = {};

     /* * * * * * *
      * clients
      *-----------
      * Client Container
      */
     static clients = {};
 
     /* * * * * * *
      * connections
      *-----------
      * Connections Container
      */
    static connections = {};

    static config = {}
    static transportOption = {}
    
    get channels () {
        return Container.channels
    }

    get clients () {
        return Container.clients
    }

    get connections () {
        return Container.connections
    }

    async registerChannel (channel) {
        Container.channels[channel.channelId] = channel
    }

    async registerClient (client) {
        Container.clients[client.clientId] = client
    }


    static registerConnection (connection) {
        Container.connections[connection.connectionId] = connection
    }
}