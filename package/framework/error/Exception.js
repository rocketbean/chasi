const log = require("../../Logger");

class Exception {
    static errors;
    /**
     * Error Response types:
     *          ---------------------------------------
     * Log      | error only logs at Logger::Class,
     * Warn     | no implementation will be affected,
     * Break    | drops the invoker instance,
     * Stop     | stops the parent invoker,
     * severe   | breaks all the process
     *          ---------------------------------------
     */
    static _severity = ['log', 'warn', 'break', 'stop', 'severe'];

    constructor (message, severity, invoker) {
        this.invoker = invoker;
        this.message = message;
        this.severity = Exception._severity[severity];
        this._s = severity
        this.logging = parseInt(process.env.debugLogging) || 0;
    }

    LogErrorMessage (message, type = "warning") {
        return log.msg(this.#constructMessage(message), 0, type);
    }

    #constructMessage (message) {
        switch (this.logging) {
            case 0:
                if(!(message instanceof String)) 
                    // return `${this.invoker}: ${message?.message}`;
                break;

            case 1:
                if(message instanceof Error) return message.stack;
                else return message;
                break

            default:
                return message;
                break;
        }
 
    }

    executeError() {
        switch (this._s) {
            case 0: return this.LogErrorMessage(this.message);
            case 1: return Exception.errors.push(this);
            case 2: return this.#invokeBeakScript();
            case 3: return this.#invokeStopScript();
            case 4: return this.#invokeStopOperation();
            default: return Exception.errors.push(this);
        }
    }

    #invokeBeakScript () {
        this.logging = 1
        this.LogErrorMessage("error: clean exit executed ");
        this.LogErrorMessage(this.message, "danger");
        this.LogErrorMessage(this, "danger");
        process.exit();
    }

    #invokeStopScript () {
        this.logging = 1
        this.LogErrorMessage("error: breaks process execution");
        this.LogErrorMessage(this.message, "severe");
        this.LogErrorMessage(this, "severe");
        process.exit(1);
    }

    #invokeStopOperation () {
        this.LogErrorMessage("error: breaks process execution");
        this.LogErrorMessage(this, "severe");
        this.LogErrorMessage(this.message, "severe");
        process.exit(2);
    }


    toJson () {
        return {
            invoker: this.invoker,
            message: this.message,
            severity: this.severity,
        }
    }

    logMessage () {
        this.LogErrorMessage(this.message, "light");
    }

    static initializeException (errors) {
        Exception.errors = errors;
    }
}

module.exports = Exception;