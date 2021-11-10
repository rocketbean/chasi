module.exports = {
    staticDir: "storage",

    /**
     * [enableSocketServer]
     * if enabled, the instance will
     * automatically boot the 
     * socketServer
     */
    enableSocketServer: true,
    socketMiddlewares : [

        '/middlewares/userSession.mw.js',
    ],

    /**
     * [port] 
     * a [BreakExecutionError] will be 
     * thrown if the port selected 
     * is unavailable.
     */
    port: checkout(process.env.PORT, 3000),
    environment: checkout(process.env.environment, 'local'),

    /**
     * you can setup your own server environment
     * and add that inside [mode] property
     * change the [environment] property to the desired
     * selection, just keep make sure that the selected
     * environment is registered here...
     */
    mode: {
        dev: {
            key: checkout(process.env.SSLcontainerKey, 'local'),
            cert: checkout(process.env.SSLcontainerCrt, 'local'),
            protocol: 'https',
        },
        local: {
            key: checkout(process.env.SSLcontainerKey2, 'null'),
            cert: checkout(process.env.SSLcontainerCrt2, 'null'),
            protocol: 'http',
        }
    },
}