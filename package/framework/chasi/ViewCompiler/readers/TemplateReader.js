const Reader = require('./Reader');

class TemplateReader extends Reader {
    constructor(fetch, config) {
      super();
      this.fetch = fetch;
      this.config = config;
      this.raw = fetch.raw;
    }


}

module.exports = TemplateReader;