module.exports = {
  host: checkout(process.env.database, 'dev'),
  /*
    * enabling "bootWithDB" property will throw a
    * BreakExecutionError if any of the 
    * declared connection failed on boot
   */
  bootWithDB: false,
  default: checkout(process.env.database, 'dev'),

  /**
   * 
   * -------------- [ DataBase connections ] ---------------|
   * | all instances declared will automatically            |
   * | connected once boot started, Model connections       |
   * | can be altered via {DatabaseAdapter}                 |
   * --------------------------------------------------------
   */

  connections: {
    /**
     * ---------------- { DatabaseAdapter } ------------------|
     * | $getConnection('ConnectionName': String) function    |
     * | [ConnectionName]will be switch to default            |
     * | if the declaration is non-existent                   |
     * | to chasi's current connections                       |
     * ********************************************************
     */

    dev: {
      url: checkout(process.env.dbConStringDev),
      db: checkout(process.env.devDatabaseName),
      params: '?authSource=admin',
      options: {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          useCreateIndex: true
      }
    },

    local: {
      url: checkout(process.env.dbConStringLocal),
      db: checkout(process.env.databaseName),
      options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
      }
    },

    stage: {
      url: checkout(process.env.dbConStringStage),
      db: checkout(process.env.stageDatabaseName),
      options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
      }
    }
  }
}