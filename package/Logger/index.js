const chalk = require('chalk');
const log = console.log;
class Log {
    static AllowPadding = [ 'warning', 'severe', 'subsystem']

    logType = {
        system: chalk.dim.bold.yellow,
        silver: chalk.bgGrey.yellow,
        subsystem: chalk.bgGreen.bold.rgb(0,70,0),
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
        warning: chalk.yellow,
        coolText: chalk.hex('986498'),
        lightGreen: chalk.bgGreenBright.rgb(0,0,0),
    }


    setAsHeader (str, char = '*', pad = 15) {
        let charpad = ''
        for (let i = 0; i < 10; i++) {
            charpad += char
        }
        return charpad + str + charpad
    }

    msg (message, padding = 80, type = 'system', style = null) {
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

    constructLogType(context) {
        let len = context.length;
        if(context instanceof Object) {
            len = context.text.length;
            context = this.logType[context.type](context.text)
        }
        return {context, len}
    }

    synthMessage (message) {
        let msg = message
        let left = [];
        let right = [];
        let ln = 0;
        let rn = 0;
        if(message instanceof Object) {
            msg = message.message;
            let clt = this.constructLogType.bind(this)
            left = message.left.map(clt).map(clt => {
                ln += clt.len;
                return clt.context
            });
            if(message.right) {
                right = [...message.right.map(clt).map(clt => {
                    rn += clt.len;
                    return clt.context
                })];
            }
        }
        return {msg, left, right, ln, rn};
    }

    startTrace (message, type = 'system', char = ' ') {
        let {msg, left, right} = this.synthMessage(message);
        let logMsg = ''
        let posx = Math.round(process.stdout.columns/1.3)
        let pos = Math.round(posx-msg.length);
        pos -= [...left.join("")].length
        logMsg = logMsg.padStart(pos, char)
        logMsg += msg
        log(...left,this.logType[type](logMsg), ...right)
    }

    endTrace (message, type = 'system', char = ' ') {
        let posx = Math.round(process.stdout.columns/1.5)
        let pos = Math.round(posx-message.length);
        message += message.padEnd(pos, char)
        log(this.logType[type](message))

    }

    center (message, type = 'system', char = ' ') {
        let {msg, left, right, ln} = this.synthMessage(message);
        let logMsg = ''
        msg = msg.replace(/(\r\n|\n|\r)/gm, "")
        msg = msg.replace(/   /gm, "")
        let mid = Math.round(msg.length)/2;
        let posx = Math.round(process.stdout.columns)/2
        posx -= ln
        let pos = Math.round(posx-mid);
        if((pos*2+mid*2) > process.stdout.columns) {
            pos -= (pos*2+mid*2) - process.stdout.columns
        }
        logMsg = logMsg.padStart(pos, char)
        logMsg += msg
        logMsg += logMsg.replace(msg, "").padEnd(pos, char)
        if((logMsg.length + ln) < process.stdout.columns) {
            let total =process.stdout.columns - (ln + logMsg.length) 
            logMsg += char.repeat(total -1)
        }
        log(...left, this.logType[type](logMsg), ...right)
    }

    full (message, type = 'system', char = ' ') {
        let logMsg = ''
        message = message.replace(/(\r\n|\n|\r)/gm, "")
        message = message.replace(/   /gm, "")
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

    loading (message = "") {
        let timer;
        let start = () => {
        var P = ["\\", "|", "/", "-", "*"];
        var x = 0;
            timer = setInterval(function() {
                x++
                process.stdout.write("\r" + chalk.bold.yellow(message + " ") + chalk.bold.yellow(P[x]) + " ");
                x %= P.length-1;
            }, 50);


        };
        let stop = () => {
            clearInterval(timer)
            process.stdout.clearLine()
            process.stdout.cursorTo(0)
        }
        return {start, stop}
    }



    custom (message, option) {
    }

}

module.exports = new Log();