const Event = require('../structures/Event');

module.exports = class extends Event {
  get options() {
    return {
      key: 'ready',
    };
  }

  run() {
    this.client.events.forEach(e => e._init());
  }
};
