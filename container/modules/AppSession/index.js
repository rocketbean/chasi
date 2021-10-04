
class AppSession {
    static constructors = ['user'];
    
    constructor (user,_t = null) {
        this.session_id = user._id;
        this.onToken = _t;
        this.user = user.toJSON();
        this.logs = [];
        this.atRoom = '';
        this.socket = { id: null }
        this.conference = null
        this.query = {}
    }

    getSocket () {
        return this.socket;
    }

    setConference(conference) {
        this.conference = conference
    }

    async initiateSocket (socket) {
        this.socket = socket;
        return true;
    }


    readLogs () {
        return this.logs;
    }

    writeLogs (message) {
        this.logs.push(message);
    }

    writeLog (message) {
        this.logs.push(message);
    }
}

module.exports = AppSession