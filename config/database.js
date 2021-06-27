module.exports = {
  host: checkout(process.env.dbhost, 'local'),
  bootWithDB: false,
  options: {
    dev: {
      url: checkout(process.env.dbConStringDev),
      db: checkout(process.env.databaseName),
      params: '?authSource=admin',
      options: {
          useNewUrlParser: true,
          useUnifiedTopology: true
      }
    },
    local: {
      url: checkout(process.env.dbConStringLocal),
      db: checkout(process.env.databaseName),
      options: {
        useNewUrlParser: true,
        useUnifiedTopology: true
      }
    }
  }
}