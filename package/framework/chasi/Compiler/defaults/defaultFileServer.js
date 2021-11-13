module.exports =`
const next = require("next");
const { parse } = require('url');

module.exports = async function(server, load, properties = {}) {
  const app = next(load);
  const handle = app.getRequestHandler();
  
  await app
    .prepare()
    .then(() => {

      server.get(`+ "`" + "${load.conf.basePath}" + "`" + `, (req, res) => {
        const parsedUrl = parse(req.url, true)
        const { query } = parsedUrl
        app.render(req,res, '/', query);
      });

      server.get(`+ "`" + "${load.conf.basePath}/*" + "`" + `, (req, res) => {
        const parsedUrl = parse(req.url, true)
        const { pathname, query } = parsedUrl
        if(pathname == null) pathname = '/'
        const realpath = pathname.replace(load.conf.basePath, "");
        if(properties.pages.includes(realpath)) {
          app.render(req,res, realpath, query);
        } else {
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

`