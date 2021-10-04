module.exports = {
  default: 'FileManager',
  drivers: {
    FileManager: {
      public: checkout(process.env.publicUrl, ''),
      multerConfig: {
        autoRetry: true,
        maxRetries: 2,
        keyFilename: checkout(process.env.filestorageKey, ''),
        projectId: checkout(process.env.filestorageId, ''),
        bucket: checkout(process.env.filestorageBucket, ''),
        acl: checkout(process.env.filestorageAcl, ''),
      }
    }
  }
}