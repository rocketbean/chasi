console.clear() 
import dotenv from 'dotenv';
import path from 'path';
dotenv.config()
global.basepath = path.resolve(path.dirname(''));
global.checkout = (val, backup) => {
  if(val == undefined  || val == null) return backup
  else return val
}
import {Events} from './package/events/index.js';
import log from './package/Logger/index.js'
import Package from './package/handler.js';

global.events = new Events();
global.log = log;

(async () => {
  let ph = await Package.install(global.basepath);
})()
