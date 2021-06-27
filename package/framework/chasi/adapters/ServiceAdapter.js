const Adapter = require('./adapters')
class ServiceAdapter extends Adapter {
    static buffervar = 'serviceadapter'
    static logging = process.env.adapterLogging > 0 ? true:false;

    constructor (services) {
        super()
        this.services = services;
        this.bootfiles = {};
        this.booted = {};
    }

    autoload () {
        if(ServiceAdapter.logging) log.msg(`BOOTING SERVICES`, 45, "subsystem")
        Object.keys(this.services).map(service => {
            this.bootfiles[service] = this.assignFile(this.services[service]);
            if(ServiceAdapter.logging) log.msg(`booting service:: ${service}`, 80, "positive")
        })
        if(ServiceAdapter.logging) log.msg(`END BOOTING SERVICES`, 45, "subsystem")
        return this.callStaticBoot();
    }

    callStaticBoot() {
        Object.keys(this.bootfiles).map(b => {
            try {
                this.booted[b] = this.bootfiles[b].boot()
            } catch(e) {
                this.exception(e.stack, `\n failed to boot service ${b}:: ${e.message}`, 1);
            }
        })
        return this.booted;
    }

}
module.exports = ServiceAdapter;