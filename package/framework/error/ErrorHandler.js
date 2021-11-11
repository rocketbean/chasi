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

    exception (message, severity = 1, invoker = null) {
        let err = new Error(message);
        Error.captureStackTrace(err, this.exception);
        if(invoker == null) invoker = this.invoker;
        let exc = new Exception(err, severity, invoker)
        ErrorHandler.all.push(exc);
        if(process.env.logRuntimeRequestError > 0) {
            exc.logMessage()
        }
        return this.takeAction(exc);
    }

    takeAction (exc) {
        if(exc instanceof Exception) exc.executeError();
    }

    pushToError (exception) {
        ErrorHandler.errors.push(exception)
    }

    static pushStaticError(err, severity = 0, stage) {
        let exc = new Exception(err, severity, stage)
        ErrorHandler.errors.push(exc)
    }

    static tail () {
        if(ErrorHandler.errors.length <= 0) {
            log.startTrace("clean: empty error list", "positive", "-");
            log.full(" ");
        }
        ErrorHandler.errors.forEach(err => {
            err.logMessage()
        })
    }
}

module.exports = ErrorHandler