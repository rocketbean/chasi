const property = require('./../../../config/storage');
const imageResizer = require ('./bin/imageResizer');
const FileUploader = require('./bin/uploader');
const multer = require('multer')
const mongoose = require("mongoose")
const ObjectId = mongoose.Types.ObjectId; 
const path = require('path');

var multerGoogleStorage = require("multer-google-storage");

module.exports = class FileManager {
    static constructors = [];
    static $instance = null;
    constructor(property) {
        this.property = property.drivers[property.default];
        this.extras = {
          imageResizer
        }
    }
    async avatar (req, res, next) {
      req.body.files = {}
      let config = property.drivers[property.default].multerConfig;
      let ir = new imageResizer(req.files.avatar, req.body.files)
      await ir.avatarSizes();
      let up = new FileUploader();
      await Promise.all(Object.keys(req.body.files).map(async file => {
        try {
          req.body.files[file] = await up.upload(req.body.files[file], req)
        } catch (e) {
          console.log(e.message, "image upload error")
        }
      }))
    }

    async processFile (file, container) {
      file.name = file.name.trim();
      file.name = file.name.replace(/\s/g,'');
      file.key = ObjectId().toString();
      file.ext = path.extname(file.name);
      if(file.mimetype.includes("json")) throw new Error("stream readable files are not allowed")
      if(file.mimetype.includes("image")) {
        let resizer = new imageResizer(file, container);
        await resizer.imageResize();
      } else {
        file.path = basepath + '/storage/temp/' + file.name;
        file.uploaded = false
        await file.mv(file.path)
        container[file.name] = file
      }
      return container;
    }

    spread (req, res, next) {
      next()
    }

    static init(property) {
      let $instance = new FileManager(property.storage)
      FileManager.$instance = $instance
      return $instance;
    }
}