import {Base} from "./base.js";
import log from "./Logger/index.js";
import {Server} from "socket.io";
import Negotiator from "./cluster.js";
import {Chasi} from "./framework/chasi/chasi.js";
import fileUpload from "express-fileupload";
import {Injector} from "./bootloader/injector.js";
import ModelHandler from "./bootloader/Model.js";
import {framework} from "./framework/frontload/index.js";
import {Controller} from "./statics/Controller.js";
import Adapter from "./statics/Adapter.js";
import {ServerWrap} from "./framework/exec/server.js";
import {SocketWrapper} from "./framework/exec/socket.js";
import {Configurator} from "./bootloader/configurator.js";
import {PackageLoader} from "./framework/PackageLoader.js";
import {ErrorHandler} from "./framework/error/ErrorHandler.js";
import SocketAdapter from "./framework/chasi/adapters/SocketAdapters.js";

export default class PackageHandler extends Negotiator(Injector, ErrorHandler) {
  constructor (property) {
    super();
    this.property = property
    this.installed = false
    this.ready = false
    this.status = 'untapped'
    this.internals = {};
    this.packages = null;
  }


  /**
   * runtime status log 
   * @param {RunTime Log} message 
   */
  setStatus (message) {
    log.msg(message, 30, "system")
    this.status = message
  }

  /**
   * initializes static classes
   */
  async init() {
    try {
      framework.loadStaticProperty(this._g, this.property)
      await ModelHandler.ready();
      let fw = new framework()
      this.internals = await fw.callstack(this._g);
      this.setStatus("initialized");
      await this.before()
    } catch (e) {
      log.msg(e.stack, 0 , "danger")
    }
  }

  /**
   * instantiate dependency class
   * before app instance
   */
  async before () {
    try {
      this.$app = this.internals.app;
      console.log(this.internals.app)
      ServerWrap.initialize(this._g, this.property,this.$app);
      this.internals['server'] = new ServerWrap();
      this.$server = this.internals.server.install();
      await this.connectDbInstsance()
      this.$io = new Server(this.$server);
      SocketAdapter.setIo(this.$io);
      Base.install(this._g, this.property, this.$server, this.$app);
      this.injectCorsProperties();
      this.$packages = new PackageLoader();
      await Controller.init(this.property, this.$packages);
      await Adapter.init(this.property);
      this.setStatus("setting up server");
      this.instantiate();
    } catch (e) {
      log.msg(e.stack, 0 , "danger")
    }

  }

  /**
   * create Chasis instance
   * *
   */
  async instantiate () {
    try {
      this.$app.use(this._g.express.json())
      this.$app.use(fileUpload())
      this.$app.use(this._g.bodyParser.urlencoded({extended: true}));
      this.$chasi = Chasi.install(this.$app, {
        $packages: this.$packages,
        $server: this.$server,
        $io: this.$io
      });
      this.setStatus("Instantiating App Class");
      this.after(); 
    } catch (e) {
      log.msg(e.stack, 0 , "danger")
    }
  }

  async after () {
    this.boot()
    this.setStatus("after App Instance");
    this.CheckStaticErrors();
    this.$app.use((req, res, next) => {
      res.status(404);
      res.send('404: Path Not Found');
    });
  }

  boot () {
    this.$server.listen(this.property.server.port, () => {
      log.msg(`server is up on PORT:  ${this.property.server.port}` );
    })
  }

  /**
   * read filestring path
   * @param {filesystem} path 
   */
  getFileSync (path) {
    return this._g.fs.readFileSync(path)
  }

  /**
   * connect database instance
   */
  async connectDbInstsance () {
    if(this.property.database.bootWithDB) return await this.internals.database.connect();
    else return await this.internals.database?.connect();
  }

  CheckStaticErrors() {
    ErrorHandler.tail();
  }

  injectCorsProperties () {
    this.$app.use(this._g.cors(this.property.cors));
  }

  static async install(dir) {
    let configurator = new Configurator();
    await configurator.setProps()
    let ph = new PackageHandler(configurator.bootload());
    await ph.init();
    return ph;
  }
}
// module.exports = PackageHandler;