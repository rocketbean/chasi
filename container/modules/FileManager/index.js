const property = require('./../../../config/storage');
const multer = require('multer')
const mongoose = require("mongoose")
const path = require('path');

module.exports = class FileManager {

    static constructors = [];
    static $instance = null;

    constructor(property) {
        this.property = property.drivers[property.default];
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