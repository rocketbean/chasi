const { exec } = require('child_process');

module.exports =  async (path) => {
  return new Promise((res, rej) => {
    exec(`mkdir "${path}"`, (error, stdout, stderr) => {
      if (error) {
        rej(error)
        return;
      }
      res();
    })
  })
}