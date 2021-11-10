const Fetcher = require('./fileFetcher');
const TemplateReader = require("./readers/TemplateReader");
const ComponentReader = require("./readers/ComponentReader");
const View = require('./View');
class Compiler extends View{

  constructor (config) {
    super();
    this.config = config;
    this.components = {}
    this.templates = {}
    this.assets = {}
    this.raw = {}
  }

  async render (property) {
    try {
      return await this.builder(property)
    } catch (e) {
      this.exception(e.message, 0)
    }
  }

  async getTemplates(property) {
    Object.keys(this.config.templates).map(key => {
      let template = new Fetcher(this.config.templates[key]);
      template.fetch();
      this.templates[key] = template
    })
  }

  async getComponents() {
    Object.keys(this.config.components).map(key => {
      let component = new Fetcher(this.config.components[key]);
      component.fetch();
      this.components[key] = component
    })
  }

  async getAssets() {
    Object.keys(this.config.assets).map(key => {
      let asset = new Fetcher(this.config.assets[key]);
      asset.fetch();
      this.assets[key] = asset
    })
  }

  async init () {
    await this.getTemplates();
    await this.getComponents();
    await this.getAssets();
  }
}
module.exports = Compiler;