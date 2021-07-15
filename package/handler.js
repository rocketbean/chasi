const Base = require('./base');
const log = require('./Logger');
const socketio = require("socket.io");
const Negotiator = require('./cluster');
const Chasi = require('./framework/chasi/chasi')
const fileUpload = require('express-fileupload');
const Injector = require('./bootloader/injector');
const ModelHandler = require('./bootloader/Model');
const framework = require('./framework/frontload');
const Controller = require('./statics/Controller');
const Adapter = require('./statics/Adapter');
const ServerWrap = require('./framework/exec/server');
const SocketWrapper = require('./framework/exec/socket');
const Configurator = require('./bootloader/configurator');
const PackageLoader = require('./framework/PackageLoader');
const ErrorHandler = require('./framework/error/ErrorHandler');
const SocketAdapter = require('./framework/chasi/adapters/SocketAdapters');

class PackageHandler extends Negotiator(Injector, ErrorHandler) {
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
      ServerWrap.initialize(this._g, this.property,this.$app);
      this.internals['server'] = new ServerWrap();
      this.$server = this.internals.server.install();
      await this.connectDbInstsance()
      this.$io = socketio(this.$server);
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
    let ph = new PackageHandler(new Configurator().bootload());
    await ph.init();
    return ph;
  }
}
module.exports = PackageHandler;