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

    async autoload () {
        if(ServiceAdapter.logging) log.msg(`BOOTING SERVICES`, 45, "subsystem")
        Object.keys(this.services).map(service => {
            this.bootfiles[service] = this.assignFile(this.services[service]);
            if(ServiceAdapter.logging) log.msg(`booting service:: ${service}`, 80, "positive")
        })
        if(ServiceAdapter.logging) log.msg(`END BOOTING SERVICES`, 45, "subsystem")
        return await this.callStaticBoot();
    }

    async callStaticBoot() {
        await Promise.all(Object.keys(this.bootfiles).map(async b => {
            try {
                this.booted[b] = await this.bootfiles[b].boot()
            } catch(e) {
                this.exception(`${b}::Error \n failed to boot service \n ${b}:: ${e.stack}`, 1);
            }
        }))
        return this.booted;
    }

}
module.exports = ServiceAdapter;