const chalk = require('chalk');
const log = console.log;
class Log {
    static AllowPadding = [ 'warning', 'severe', 'subsystem']

    logType = {
        system: chalk.bgGrey.yellow,
        subsystem: chalk.bgBlue.yellow,
        light: chalk.yellow,
        bgpositive: chalk.green.bgBlack,
        positive: chalk.green,
        json: chalk.white,
        clear: chalk,
        danger: chalk.red.bgWhite,
        severe: chalk.red.bgBlack,
        warning: chalk.yellow.bgRed,
    }


    setAsHeader (str, char = '*', pad = 15) {
        let charpad = ''
        for (let i = 0; i < 10; i++) {
            charpad += char
        }
        return charpad + str + charpad
        //  console.log(charpad)
    }

    msg (message, padding = 80, type = 'system') {
        if(message instanceof Object) {
            let _n = this.setAsHeader(message.constructor.name) + "\n";
            log(this.logType["system"](_n))
            if(typeof message !== "function") {
                message = JSON.stringify(message, null, 4);
                message = message.replace(/  /g, "--")
                message = `%${message}%`
            }
        }


        if(Log.AllowPadding.includes(type)) {
            if(!message instanceof Object) {
                const raw = message;
                message = message.padStart(padding, '*')
                message += '*'.repeat(message.split("*").length - 1)
            }
        }

        if(type === 'positive') {
            message = message.padStart(padding, '-')
        }

        log(this.logType[type](message))
    }

    custom (message, option) {
    }

}

module.exports = new Log();