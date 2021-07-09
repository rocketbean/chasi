const chalk = require("chalk");
const { base } = require("./container/Models/User");
const kernel = require("./package/commands/kernel");
const basepath = __dirname
const paths = {
  controller: `${basepath}\\container\\controllers\\`,
  middleware: `${basepath}\\container\\middlewares\\`,
  model: `${basepath}\\container\\Models\\`,
  provider: `${basepath}\\container\\services\\`,
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
const $commands = ['_new', '_view'];

class CommandRegistry {
  _new (arg) {
    if(!arg) throw new Error("Command: [new] requires an argument")
    let secondLayerArg = arg.slice(1);
    let container = kernel[arg[0]](secondLayerArg, basepath)
    kernel.write(container, paths[arg[0]])
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