const { EventEmitter } = require('events');
const mysql = require('mysql');
const Model = require('../util/SqlModel');

module.exports = class MySql {
  constructor(url) {
    // TODO: Options
    /**
     * @name DB#_models
     * @type {Array<Model>}
     * @private
     */
    this._models = [];
    this.url = url;
    this.emitter = new EventEmitter();
    this.open(url);
  }

  /**
   * @returns {*}
   */
  close() {
    this.emitter.emit('disconnected', this);
    return this.db.end();
  }

  /**
   * @param {String} url
   * @param {Object} options
   * @returns {*}
   */
  open(url) {
    if (!url) url = this.url;
    if (typeof url !== 'string') {
      throw new TypeError('DB uri must be a string.');
    }
    this.url = url;
    this.db = mysql.createConnection(this.url);
    return new Promise((res, rej) => {
      this.db.connect(err => {
        if (err) {
          this.emitter.emit('error', err);
          return rej(err);
        }
        this.emitter.emit('connected', this);
        res(this.db);
      });
    });
  }

  /**
   * @param {String} name
   * @param {Object} options
   * @returns {DB} db
   * @example db.addModel('modelname', {
   *  id: { type: String, default: undefined },
   *  messageCount: { type: Number, default: 0 },
   * });
   */
  addModel(name, options) {
    if (typeof name !== 'string') {
      throw new TypeError('Name argument must be a string.');
    }
    name = name.toLowerCase();
    if (this._models.includes(name)) {
      throw new ReferenceError(`Model with name ${name} already exists`);
    }
    if (typeof options !== 'object') {
      throw new TypeError('Options argument must be an object.');
    }
    const defaultOptions = {};
    for (const key in options) {
      if ({}.hasOwnProperty.call(options, key)) {
        defaultOptions[key] = options[key].default;
        options[key] = options[key].type;
      }
    }
    options._id = 'VARCHAR(20)';
    defaultOptions._id = undefined;
    this._models.push(name);
    this[name] = new Model(this.db, name, options, defaultOptions);
    return this;
  }
};
