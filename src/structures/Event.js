const Base = require('./Base');

const defaultOptions = {
  once: false,
};

module.exports = class Event extends Base {
  constructor(client, fullpath, options = {}) {
    super(client, 'event', fullpath, options);
    this._options = { ...defaultOptions, ...this._options };
    this.once = this._options.once;
    this.client.on(this.key, this._run.bind(this));
  }
};
