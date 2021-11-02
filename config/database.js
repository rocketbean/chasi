module.exports = {
  host: checkout(process.env.dbhost, 'local'),
  bootWithDB: false,
  default: "dev",
  connections: {
    dev: {
      url: checkout(process.env.dbConStringDev),
      db: checkout(process.env.devDatabaseName),
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
    },
    test: {
      url: checkout(process.env.dbConStringLocal),
      db: checkout(process.env.testDatabaseName),
      options: {
        useNewUrlParser: true,
        useUnifiedTopology: true
      }
    }
  }
}