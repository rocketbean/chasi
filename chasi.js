const chalk = require("chalk");
const kernel = require("./package/commands/kernel");
const basepath = __dirname
const helpers = require('./package/helper');
const _path = require("path")
const { exec } = require('child_process');

const paths = {
  controller: `${basepath}\\container\\controllers\\`,
  middleware: `${basepath}\\container\\middlewares\\`,
  model: `${basepath}\\container\\Models\\`,
  provider: `${basepath}\\container\\services\\`,
  event: `${basepath}\\container\\events\\`,
  install: `container\\views`,
}

var arguments = process.argv.slice(2)

/*
 * First layer arguments
 */
var command = arguments[0]

/*
 * setup second layer arguments
 */
var args = arguments.slice(1)


/* * * * * * * * * * * * *
 * Proxy Handlers
 * [Kernel]
 * * * * * * * * * * * * */
var handler = {
  get: function (target, name) {
    return name in target ? target[name] : false
  },
  apply: function (target, state, args) {
    Reflect.apply(target, null, args)
  }
}


/* * * * * * * * * * * * *
 * Get CommandLine function names 
 * [New, View]
 * * * * * * * * * * * * */
const $commands = ['_new', '_view', '_mount', '_install'];

class CommandRegistry {
  _new (arg) {
    if(!arg) throw new Error("Command: [new] requires an argument")
    let secondLayerArg = arg.slice(1);
    let container = kernel[arg[0]](secondLayerArg, basepath)
    kernel.write(container, paths[arg[0]])
  }

  _install (arg) {
    var normalizedPath = _path.join(basepath,paths["install"])
    exec(`cd "${normalizedPath}" && npm install `, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
    })
  }


  _mount () {
    // require("./server")
  }

  _view () {
    console.log("test")
  }
}
_c = new CommandRegistry()
command = `_${command}`;
if(!$commands.includes(command)) {
  console.error(`command: [${command}] isn't on our command list.`)
}

/* * * *   RUN COMMAND * * * * */
_c[command](args)