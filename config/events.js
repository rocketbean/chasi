
module.exports = {
  
  /**
   * registered event methods will not fire
   * if this option is disabled;
   * 0|false to disable
   * 1|true to enable
   */
  enabled: true,

  /**
   * Register your events here,
   * accesible in controllers via
   * [$observer] property.
   * you can fire the event by declaring:
   * this.$observer.emit(<event_name>:String)
   */
  events: {
    'authorized': 'container/events/AuthorizedEvent',
    'build-compiler': 'container/events/BuildCompiler',
  },

  /**
   * after the Event fire() method
   * [emitted()] method will be called
   * this method can be overwritten inside
   * your declared Event class or by changing
   * it here, to apply in all of the 
   * registered event
   * NOTE: this method will refer to the
   * Event instance.
   */
  afterEmit: async function (params) {
    log.startTrace(`| Emitted::${this.constructor.name}`, 'positive', '-')
  }
}