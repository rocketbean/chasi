module.exports = (argument) => {
  let uppercased = argument.charAt(0).toUpperCase()+argument.slice(1)
  return `
  class ${argument} {
    
    static boot () {
        // return {}
    }
  }
  module.exports = ${argument}`
}