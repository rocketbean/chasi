const Compiler = require("./Compiler");
const Fetcher = require("./fileFetcher");
class ViewCompiler {
  static $property;
  
  /**
   * You can also use 
   * frameworks like 
   * Next.js 
   */
  static $next;
  static $nuxt;
  /*
  * Kernel Config
  * Registry
  */
  static $registry = {}

  constructor () {
  }

  get defaultCompiler () {
    return ViewCompiler.$registry[ViewCompiler.$property.config];
  }

  async view (property = {}, compiler = false) {
    if(!compiler) compiler = this.defaultCompiler.compiler
    return await compiler.render(property)
  }


  static async init (property) {
    ViewCompiler.$property = property
    await this.getKernel();
  }

  static async initCompiler(compiler){
    ViewCompiler.$next = compiler
  }

  static async getKernel () {
    Object.keys(ViewCompiler.$property.stack).map(async key => {
      let config = handle(ViewCompiler.$property.stack[key]);
      let compiler = new Compiler(config);
      await compiler.init()
      ViewCompiler.$registry[key] = {
        config,
        compiler
      }
    })
  }
}

module.exports = ViewCompiler