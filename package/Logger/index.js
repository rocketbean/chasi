const chalk = require('chalk');
const log = console.log;
class Log {
    static AllowPadding = [ 'warning', 'severe', 'subsystem']

    logType = {
        system: chalk.dim.bold.yellow,
        silver: chalk.bgGrey.yellow,
        subsystem: chalk.bgGreen.rgb(0,0,0),
        light: chalk.green,
        bgpositive: chalk.green.bgBlack,
        positive: chalk.green,
        negative: chalk.red,
        magenta: chalk.magenta,
        cool: chalk.bgHex('484276'),
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
    }

    msg (message, padding = 80, type = 'system') {
        if(Number(checkout(process.env.logCharPad))) padding = Number(checkout(process.env.logCharPad))
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

        if(type === 'positive' || type === 'magenta') {

            message = message.padStart(padding, '-')
        }

        log(this.logType[type](message))
    }

    startTrace (message, type = 'system', char = ' ') {
        let logMsg = ''
        let posx = Math.round(process.stdout.columns/1.5)
        let pos = Math.round(posx-message.length);

        logMsg = logMsg.padStart(pos, char)
        logMsg += message
        log(this.logType[type](logMsg))

    }

    endTrace (message, type = 'system', char = ' ') {
        let posx = Math.round(process.stdout.columns/1.5)
        let pos = Math.round(posx-message.length);

        message += message.padEnd(pos, char)
        log(this.logType[type](message))

    }

    center (message, type = 'system', char = ' ') {
        let logMsg = ''
        let mid = Math.round(message.length)/2;
        let posx = Math.round(process.stdout.columns)/2
        let pos = Math.round(posx-mid);
        if((pos*2+mid*2) > process.stdout.columns) {
            pos -= (pos*2+mid*2) - process.stdout.columns
        }

        logMsg = logMsg.padStart(pos, char)
        logMsg += message
        logMsg += logMsg.replace(message, "").padEnd(pos, char)
        if(logMsg.length < process.stdout.columns) {
            let total =process.stdout.columns - logMsg.length 
            logMsg += char.repeat(total)
        }

        log(this.logType[type](logMsg))
    }

    full (message, type = 'system', char = ' ') {
        let logMsg = ''
        let msg = Math.round(message.length);
        let posx = Math.round(process.stdout.columns)
        let pos = Math.round(posx-msg);
        if((pos+msg) > process.stdout.columns) {
            pos -= (pos+msg) - process.stdout.columns
        }
        logMsg += message
        logMsg += logMsg.replace(message, "").padEnd(pos, char)
        log(this.logType[type](logMsg))
    }

    custom (message, option) {
    }

}

module.exports = new Log();