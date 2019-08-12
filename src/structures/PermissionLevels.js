const Collection = require('../util/Collection');

module.exports = class PermissionLevels {
  constructor() {
    this._id = 0;
    this._collection = new Collection();
    this._collection.set(this._id, { brk: true, fn: () => true });
    this._id += 1;
  }

  _getId() {
    return this._id++;
  }

  addLevel(level, brk, fn) {
    if (!level) level = this._getId();
    if (this._collection.has(level)) {
      throw new Error(`Level ${level} already exists.`);
    }
    if (typeof fn !== 'function') {
      throw new TypeError('Fn argument must be a function.');
    }
    brk = Boolean(brk);
    if (typeof brk !== 'boolean') {
      throw new TypeError('Brk argument must be boolean.');
    }
    this._collection.set(level, { brk, fn, level });
    return this;
  }

  async _test(level, message) {
    while (!this._collection.has(level)) {
      if (!this._collection.find(e => e.level > level)) return false;
      level += 1;
    }
    const { brk, fn } = this._collection.get(level);
    let res = fn(message);
    if (fn.constructor.name === 'AsyncFunction') res = await res;
    if (res) return res;
    if (!brk) return this._test(level + 1, message);
    return false;
  }

  async test(level, message) {
    if (!this._collection.has(level)) return false;
    const { brk, fn } = this._collection.get(level);
    let res = fn(message);
    if (fn.constructor.name === 'AsyncFunction') res = await res;
    if (res) return res;
    if (!brk) return this._test(level + 1, message);
    return this.test();
  }

  get length() {
    return this._collection.length;
  }

  add(...args) {
    return this.addLevel(...args);
  }
};
