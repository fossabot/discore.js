const Base = require('./Base');

const defaultOptions = {
  once: false,
};

module.exports = class Event extends Base {
  constructor(client, fullpath, options = {}) {
    const childOptions = this.settings || this.options || {};
    if (typeof childOptions !== 'object') {
      const err = 'Options must return an object.';
      this.client.emit('error', err);
    }
    options = { ...defaultOptions, ...childOptions, ...options };
    const thisOptions = {
      once: options.once,
    };
    delete options.once;
    super(client, 'event', fullpath, options);
    this.once = thisOptions.once;
    this.client.on(this.key, this._run.bind(this));
  }

  _run(...args) {
    if (this.enabled) this.run(...args);
    if (this.once) this.unload();
  }

  run() {
    const err = 'Run method must be defined';
    this.client.emit('error', err);
  }
};
