module.exports = {
  /**
   * Compile Drivers
   */
  driver: 'NextJs',
  enabled: true,
  configs: {
    /**
     * Driver Configurations
     * E.G: 
     * your frontend environment files,
     * runtime configs,
     */
    NextJs: {

      /**
       * chasi will append it's root path
       * to [root] property.
       * then paths declared as root
       * Note: Only enable 
       * when the compiler's root 
       * is outside Chasi's root dir.
       */
      useAbsolutePath: false,

      /**
       * Chasi's FileServer name
       * as entrypoint
       */
      fileServer: 'chasi.server.js',
      
      /**
       * Chasi's FileServer name
       * as entrypoint
       */
      root:  '/container/views/',
      reactStrictMode: true,
      useFileSystemPublicRoutes: false,

      /**
       * for Static mode
       * Note: builing Static will
       * replace distDir option
       * on [next.config.js] 
       */
      useStatic: true,

      /**
       * Static Directory
       * on which where the 
       * build files will be placed
       */
      staticDir: '/build',

      /**
       * Static Path
       * the route[path] to use
       * when serving the files under
       * [staticDir]
       */
      staticPath: '/public',

      /**
       * SubModules to install
       * chasi will automatically
       * load the submodule path
       * from a separate repository
       * if enabled
       */
      submodule: {
        enabled: true,
        path: 'https://github.com/rocketbean/Chasi-Next.git'
      },

      /**
       * NextJS load Configurations
       */
      load: {
        dev: true,
        quiet: true,
        conf: {
          url: "/",
          reactStrictMode: false,
          basePath: '/next',
          useFileSystemPublicRoutes: false,
        }
      }
    }
  }
}