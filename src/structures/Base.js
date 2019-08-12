const path = require('path');

const defaultOptions = {
  enabled: true,
  key: null,
  name: null,
};

module.exports = class Base {
  constructor(client, type, fullpath, options = {}) {
    this.client = client;
    const childOptions = this.settings || this.options || {};
    if (typeof childOptions !== 'object') {
      const err = 'Options must return an object.';
      this.client.emit('error', err);
    }
    options = { ...defaultOptions, ...childOptions, ...options };
    /**
     * @name Base#_options
     * @type {Object}
     * @private
     */
    this._options = options;
    this.id = this.client.uniqid.gen();
    this.dir = path.dirname(fullpath);
    this.file = path.basename(fullpath);
    this.type = type;
    this.enabled = this._options.enabled;
    this.key =
      this._options.key ||
      this._options.name ||
      this.file
        .split('.')
        .slice(0, -1)
        .join('.');
    this.name = this.key;
  }

  /**
   * @param {...*} ...args
   * @private
   */
  _run(...args) {
    if (this.enabled) this.run(...args);
    else this.disabledRun(...args);
    if (this.once) this.unload();
  }

  /**
   *
   */
  run() {
    const err = 'Run method must be defined';
    this.client.emit('error', err);
  }

  /**
   *
   */
  disabledRun() {}

  /**
   * @returns {Base}
   */
  toggle() {
    if (this.enabled) this.enabled = false;
    if (!this.enabled) this.enabled = true;
    this.client.emit(`${this.type}Toggled`, this);
    return this;
  }

  /**
   * @returns {Base}
   */
  unload() {
    this.client.emit('error', 'Soon!');
    return this;
  }

  /**
   * @returns {Base}
   */
  reload() {
    this.client.emit('error', 'Soon!');
    return this;
  }

  /**
   * @returns {Base}
   */
  disable() {
    const isEnabled = this.enabled;
    this.enabled = false;
    if (isEnabled) this.client.emit(`${this.type}Disabled`, this);
    return this;
  }

  /**
   * @returns {Base}
   */
  enable() {
    const isEnabled = this.enabled;
    this.enabled = true;
    if (!isEnabled) this.client.emit(`${this.type}Enabled`, this);
    return this;
  }

  /**
   * @returns {String} Name
   */
  toString() {
    return this.key;
  }

  /**
   * @private
   */
  _init() {
    return this.init();
  }

  /**
   *
   */
  init() {}
};
