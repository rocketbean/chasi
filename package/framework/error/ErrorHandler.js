const Exception = require('./Exception');
const log = require("../../Logger");
class ErrorHandler {
    static errors = [];
    static all = [];
    /**
     * Error Response types:
     *          ---------------------------------------
     * Log      | immediately logs the error Logger::class ,
     * Warn     | only show logs when checked,
     * Break    | drops the invoker instance,
     * Stop     | stops the parent invoker,
     * severe   | breaks all the process
     *          ---------------------------------------
     */
    static _severity = ['log', 'warn', 'break', 'stop', 'severe'];

    constructor () {
        Exception.initializeException(ErrorHandler.errors);
        this.invoker = this.constructor.name;
    }

    exception (message, severity = 1) {
        let err = new Error(message);
        Error.captureStackTrace(err, this.exception);
        let exc = new Exception(err, severity, this.invoker)
        ErrorHandler.all.push(exc);
        return this.takeAction(exc);
    }

    takeAction (exc) {
        if(exc instanceof Exception) exc.executeError();
    }

    pushToError (exception) {
        ErrorHandler.errors.push(exception)
    }

    static tail () {
        if(ErrorHandler.errors.length <= 0) log.msg("clean: empty error list", 20, "positive");
        ErrorHandler.errors.forEach(err => {
            err.logMessage()
        })
    }
}

module.exports = ErrorHandler