module.exports = {
    port: 3000,
    staticDir: "storage",
    enableSocketServer: true,
    socketMiddlewares : [
        /**
         * [Socket Middlewares]
         * socket middlewares are registered here
         */
        
        '/middlewares/userSession.mw.js',
    ]
}