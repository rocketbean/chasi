module.exports = {
  driver: 'NextJs', // [default, NextJs, NuxtJs]
  configs: {
    NextJs: {
      useAbsolutePath: true,
      fileServer: 'chasi.server.js',
      root: 'C:\\Users\\buzzo\\OneDrive\\Desktop\\external\\wat',
      reactStrictMode: true,
      useFileSystemPublicRoutes: false,
      useStatic: true,
      staticDir: '/build',
      staticPath: '/public',
      load: {
        dev: true,
        quiet: false,
        conf: {
          reactStrictMode: true,
          basePath: '/next',
          useFileSystemPublicRoutes: false,
        }
      }
    }
  }
}