const Base = require('./Base');

const defaultOptions = {
  once: false,
};

/**
 * @extends Base
 */
module.exports = class Event extends Base {
  constructor(client, store, fullpath, options = {}) {
    super(client, store, 'event', fullpath, options);
    /**
     * @name Event#_options
     * @type {Object}
     * @private
     */
    this._options = { ...defaultOptions, ...this._options };
    this.once = this._options.once;
    /**
     * @name Event#_listener
     * @type {Function}
     * @private
     */
    this._listener = this._run.bind(this);
    this.client.on(this.key, this._listener);
  }

  _unload() {
    this.client.removeListener(this.key, this._listener);
  }
};
