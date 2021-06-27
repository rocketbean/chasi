console.clear() 
const Events = require ('./package/events');
require('dotenv').config()
basepath = __dirname;

checkout = (val, backup) => {
  if(val == undefined  || val == null) return backup
  else return val
} 
const log = require('./package/Logger');

global.events = new Events();
global.log = log;

const Package = require('./package/handler');
const singleton = async () => {
  let ph = await Package.install(__dirname);
} 
singleton();
