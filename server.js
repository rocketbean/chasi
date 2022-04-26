require('dotenv').config()
basepath = __dirname;

const helpers = require('./package/helper');
const Events = require ('./package/events');
const log = require('./package/Logger');

global.events = new Events();
global.log = log;
const Package = require('./package/handler');


const singleton = async () => {
  await Package.install(__dirname);
} 
singleton();
