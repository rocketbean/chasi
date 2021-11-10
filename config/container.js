module.exports = {
    name: checkout(process.env.APPNAME, 'Chasi'),

    /**
     * Chasi will autoload this dirs,
     * look for models / schemas
     * then bind it to
     * [Event|Controller]Class
     */
    modelsDir: [
        'container/Models/'
    ],
    
    /**
     * View Blueprints
     * kernel file locations
     */
    blueprint: {
        config: 'default', //default view kernel to use
        stack: {
            'default': '/container/views/kernel.js',
        }
    },

    /**
     * install out of the box packages
     * into the app container
     */
    LoadPack: {
        'Sessions': 'package/framework/storage/session::init',
        'FileManager': 'container/modules/FileManager::init',
    },

    /**
     * Service Bootstrap
     * boostrapping app services
     */
    ServiceBootstrap: {

        /* * * * * * * * * * * * * * * * * *
         * this settings is mostly for 
         * * * * * * * [Chasi] extensions * * * *
         * this services is left outside the Chasi box due to the
         * interactions developers need to associate with this services,
         * therefore giving more versatility for dev's 
         * 
         */
        'routers': 'container/services/RouterServiceProvider',
        'auth': 'container/services/AuthServiceProvider',
        'sockets': 'container/services/SocketServiceProvider',
        // 'Mailer': 'container/services/MailerServiceProvider',
    },

    /**
     * Middlewares
     * any middlewares pointed to a 
     * route or route group or even in a route 
     * containers, should be registered here
     */
    middlewares: {
        /**
         * Register your middlewares here.
         * [alias] => require("<your middleware path in (container/middlewares/*)>")
         * after registration the middlewares will then 
         * be installed to that Chasi Route MWs Repository,
         * then you can use it in your routes
         */

    }

}
