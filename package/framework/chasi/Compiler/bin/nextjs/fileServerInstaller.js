const fileserver = require("../../defaults/nextjs/defaultFileServer");
const path = require("path");
const fs = require("fs");
let now = new Date().toISOString();

module.exports = async (root, filename, state) => {
  return new Promise((res, rej) => {
    fs.writeFile(path.join(root, filename), fileserver, function (err) {
      if (err) {
        state.logs.push(`${now} - ${err}`);
        rej(state)
      }
      state.logs.push(`${now} - deployed script [fileserver]`)
      state.status.fileserver = 1
      res(state);
    });
  })
}