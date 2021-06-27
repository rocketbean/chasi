var fs = require('fs');
const Cloud = require('@google-cloud/storage')
const path = require('path')
const property = require('./../../../../config/storage');


module.exports = class FileUploader {
    constructor () {
        let { Storage } = Cloud
        this.config = property.drivers[property.default].multerConfig;
        this.storage = new Storage({...this.config})
        this.bucket = this.storage.bucket(this.config.bucket)
        if(this.config.acl == 'publicread') {
            this.bucket.makePublic({
                includeFiles: true
            }, err => { if(err) res(err) })
        }
    }

    setFilePath (setpath, params) {
        let _p = ''
        if(setpath.includes('users')) {
          _p+= `users/${params.user}/`
          if(setpath.includes('avatar')) {
            _p+= `avatars/`
          }
        }
        return _p;
    }

    async upload(file, req) {
      return await new Promise((res, rej) => {
          fs.readFile(file.path, (err, data) => {
              if(err) rej(err.message);
              let realpath = '' + this.setFilePath(req.path, req.params)+file.name;

              let blob = this.bucket.file(realpath)
              let blobStream = blob.createWriteStream({
                  resumable: false
              })
              blobStream.on('finish', () => {
                  file.public = `https://storage.googleapis.com/${this.bucket.name}/${blob.name}`;
                  file.link = `${this.bucket.name}/${blob.name}`;
                  file.uploaded = true;
                  fs.unlinkSync(file.path)
                  delete file.path;
                  delete file.data;
                  res(file)
              }).on('error', () => {
                  rej(`Unable to upload image, something went wrong`)
              }).end(data)
          })
      })
    }
}