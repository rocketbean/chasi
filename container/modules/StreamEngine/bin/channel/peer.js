module.exports = class Peer {
  constructor (client) {
    this.client = client;
    this.producers = {}
    this.consummers = {}
  }

  async addProducer (producer) {
    this.producers[producer.id] = producer;
  }

  async consume (transport, props) {
    return await Promise.all(await Object.keys(this.producers).map(async producer => {
      let consumer = await transport.consume({
        ...props,
        producerId: this.producers[producer].id
      })
      return {
        producerId: this.producers[producer].id,
        id: consumer.id,
        kind: consumer.kind,
        rtpParameters: consumer.rtpParameters,
        type: consumer.type,
        producerPaused: consumer.producerPaused
      }
    }))
  }
}