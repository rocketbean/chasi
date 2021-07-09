
const fs = require('fs');
module.exports = {
  provider: (argument) => {
    let template =  require ("./templates/defaultProvider");
    let appendix = argument[0]
    if(argument[0].includes("/")) {
      appendix = argument[0].split("/")
    }
    if(appendix instanceof Object) appendix = appendix.pop()
    return {
      template: template(appendix),
      filename: appendix,
      path: ''
    };
  },

  controller: (argument) => {
    let template =  require ("./templates/defaultController");
    let appendix = argument[0]
    if(argument[0].includes("/")) {
      appendix = argument[0].split("/")
    }
    if(appendix instanceof Object) appendix = appendix.pop()
    return {
      template: template(appendix),
      filename: appendix,
      path: ''
    };
  },

  middleware: (argument) => {
    let template =  require ("./templates/defaultMiddleware");
    let appendix = argument[0]
    if(argument[0].includes("/")) {
      appendix = argument[0].split("/")
    }
    if(appendix instanceof Object) appendix = appendix.pop()
    return {
      template: template(appendix),
      filename: appendix + ".mw",
      path: ''
    };
  },

  model: (argument) => {
    let template =  require ("./templates/defaultModel");
    let appendix = argument[0]
    if(argument[0].includes("/")) {
      appendix = argument[0].split("/")
    }
    if(appendix instanceof Object) appendix = appendix.pop()
    return {
      template: template(appendix),
      filename: appendix,
      path: ''
    };
  },

  write (container, path) {

    let realpath = `${path}/${container.filename}.js`
    let errState = [];

    if(fs.existsSync(realpath)) {
      let error = `WriteError: ${container.filename} already exist in path: ${path}`;
      errState.push(error)
      throw error;
    }

    if(errState.length < 1) {
      fs.writeFile(realpath, container.template, function(err) {
        if(err) console.log(err);
      });
    }
  }
}