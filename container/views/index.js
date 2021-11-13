const next = require("next");
const { parse } = require('url');
const FS = require("fs")
const Path = require("path")

module.exports = async function(server) {
  const app = next({ 
    dev:  true,
    quiet: false,
    dir: './container/views'
  });
  const handle = app.getRequestHandler();
  
  await app
    .prepare()
    .then(() => {
      
      server.get("/next/*", (req, res) => {
        const parsedUrl = parse(req.url, true)
        const { pathname, query } = parsedUrl
        try {
          let Files = [];
          function ThroughDirectory(Directory) {
            FS.readdirSync(Directory).forEach(File => {
                const Absolute = Path.join(Directory, File);
                if (FS.statSync(Absolute).isDirectory()) return ThroughDirectory(Absolute);
                else return Files.push(Absolute);
            });
          }
          let dirs = ThroughDirectory(`${__dirname}/pages/`);
          console.log(Files)
          // app.render(req, res, pathname.replace("/next",""))
        } catch(e) {
          console.log(e)
          return handle(req, res);
        }

      });
    })
    .catch(ex => {
      console.error(ex.stack);
      process.exit(1);
    });

  return {app, next};
}