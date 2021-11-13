const log = require('./Logger');

module.exports = (() => {
    console.clear() 
    logger = log;
    checkout = (val, backup) => {
        if(val == undefined  || val == null) return backup
        else return val
    }

    handle = (path) => {
        return require(`${basepath}${path}`);
    }

    String.prototype.trimEllip = function (length) {
        return this.length > length ? this.substring(0, length) + "..." : this;
    }

    String.prototype.capitalize = function () {
        return this.charAt(0).toUpperCase() + this.slice(1);
    }

    

    String.prototype.randomString = function (length, separator = "_") {
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return `${this}${separator}${result}`;
    }

    String.prototype.UrlStringFormat = function () {
        let arr = this.split("");
        if(arr[arr.length-1] == '/') arr.splice(arr.length-1,1)
        return arr.join("")
    }
})()