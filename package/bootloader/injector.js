const fs = require('fs');
const cors = require("cors");
const http = require("http");
const path = require("path");
const https = require('https');
const express = require("express");
const bodyParser = require('body-parser');
const events = require('events');

class Injector {
  constructor () {
    this._g = {
      fs,
      path,
      http,
      https,
      express,
      bodyParser,
      cors,
      events
    }
  }

}
module.exports = Injector