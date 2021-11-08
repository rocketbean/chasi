const EventEmitter = require('events');
const Registry = require("./registry");
const Event = require("../statics/Event");
const ErrorHandler = require("../framework/error/ErrorHandler");

class Observer extends ErrorHandler{
  /**
   * Class[$property]
   * holds the configuration for 
   * Chasi::Observer class
   */
  static $property;
  
  constructor () {
    super();
    this.events = new EventEmitter()
    this.registry = new Registry;
    this.container = {}
  }
  
  /**
   * reads the Event Configs 
   * {./config/events}
   * registered events then runs
   * it to the registry
   */
  async getEvents () {
    await Promise.all(Object.keys(Observer.$property.events).map(async event => {

      var script = await this.registry.assignEvent(Observer.$property.events[event])

      var instance = this.proxyEvent(script)

      if(!(instance instanceof Event)) 
        throw new Error(`${event} must be an instance of Observer::event`)

      this.container[event] = {
        script,
        instance
      }

      this.watch(event)

    })).catch(e => {
      Observer.pushStaticError(e, 0, this.constructor.name)
    });
  }

  /**
   * registers the event
   * to the actual 
   * EventEmitter::class
   */
  watch (event) {
    this.events.on(event, async (property = {params: ['']}) => {
      if(Observer.$property.enabled) {
        let $ev = this.container[event].instance;
        if(property?.params.length < 1) property.params.push('');
        Reflect.set($ev, 'options', property);
        Reflect.set($ev, 'props', {
          afterEmit: Observer.$property.afterEmit
        });
        Reflect.apply($ev.validate, $ev, [property.params, async () => {
          await $ev.fire(property.params);
          await $ev.emitted();
        }]);
      }
    })
  }

  /**
   * Reads and wraps the class object
   * @param {ClassObject} script 
   * the fetched script from './container/events/'
   * @returns {Proxy} returns proxy object
   * that handles default class behaviour to reduce
   * error returns on runtime.
   */
  proxyEvent (script) {
    return new Proxy(Reflect.construct(script, []), {
      get: function (target, property) {
        return property in target ? target[property] : false;
      }
    })
  }

  /**
   * Initializes the Observer instance
   * @param {Property} Observer configurations 
   * @returns Observer instance
   */
  static async init (property) {
    Observer.$property = property
    var obs = new Observer;
    await obs.getEvents();
    return obs;
  }
  
}

module.exports = Observer;