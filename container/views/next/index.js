const next = require("next");
module.exports = function (server) {
  const next = require("next");
  
  const app = next({ dev: true });
  const handle = app.getRequestHandler();
  app
    .prepare()
    .then(() => {
      const showRoutes = require("./routes/index.js");
      server.get("*", (req, res) => {
        return handle(req, res);
      });
    })
    .catch(ex => {
      console.error(ex.stack);
      process.exit(1);
    });
}