const path = require("path");
const fs = require("fs");
const Base = handle("/package/base");

let now = new Date().toISOString();
module.exports =  async (root, state) => {
  return new Promise((res, rej) => {
    let realpath = path.join(root,'/pages')
    let pages = [];
    if(!fs.existsSync(realpath)) {
      fs.mkdirSync(realpath);
    }

    Base.throughDirs(realpath).map(page => {
      Object.keys(page).forEach(name => {
        let pagename = name.replace(path.extname(name), "");
        let _p = page[name].replace(realpath, "").replace(/\\/g, '/');
        let realname = _p.replace(path.extname(_p), "");
        if(realname === '/index') {
          realname = '/'
        }
        pages.push( realname );
      })
    })
    res({pages})
  })

}