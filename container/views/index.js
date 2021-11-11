const next = require("next");
module.exports = async function(server) {
  const next = require("next");
  const app = next({ 
    dev:  true,
    dir: './container/views'
  });
  const handle = app.getRequestHandler();
  
  await app
    .prepare()
    .then(() => {
      
      server.get("/next/*", (req, res) => {
        return handle(req, res);
      });
    })
    .catch(ex => {
      console.error(ex.stack);
      process.exit(1);
    });

    return app;
}