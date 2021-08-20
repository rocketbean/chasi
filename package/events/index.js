// const EventEmitter = require('events');
import EventEmitter from 'events'

export class Events extends EventEmitter{
    static EventsRegistry = {}


    listensTo (e, cb) {
        Events.EventsRegistry[e] = new EventEmitter();
        Events.EventsRegistry[e].on(e, cb)
    }

    call(e , params) {
        Events.EventsRegistry[e].emit(e, params);
    }
}

// module.exports = Events;