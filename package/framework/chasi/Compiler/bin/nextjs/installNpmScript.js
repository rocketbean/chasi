const path = require("path");
const fs = require("fs");
const Base = handle("/package/base");

module.exports =  async (root, props) => {
  return new Promise(async (res, rej) => {
    let package = path.join(root, 'package.json');
    var datahandler;
    await new Promise((res, rej) => {
      fs.readFile(package, 'utf8', function(err, data){
        datahandler = JSON.parse(data);
        let staticDir = path.join(basepath, props.staticDir)
        datahandler.scripts.build = `next build && next export -o ${staticDir}`;
        res()
      });
    })

    fs.writeFile(package, JSON.stringify(datahandler, null, 2), function (err) {
      if (err) rej(err);
      res();
    });
    
  })

}