export default (() => {
  global.checkout = (val, backup) => {
    if(val == undefined  || val == null) return backup
    else return val
  }
})()
