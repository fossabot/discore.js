const mongoose = require('mongoose');
const Collection = require('./Collection');

module.exports = class Model {
  constructor(name, options = {}, defaults = {}) {
    if (typeof name !== 'string') {
      const text = `First argument must be a string. Instead got ${typeof name}`;
      throw new TypeError(text);
    }
    name = name.toLowerCase();

    this.defaults = defaults;
    this.name = name;
    this._modelName = `${this.name.slice(0, 1).toUpperCase()}${this.name
      .slice(1)
      .toLowerCase()}`;
    this.collection = new Collection();
    this.Schema = new mongoose.Schema(options);
    this.Model = mongoose.model(this._modelName, this.Schema, this.name);
    this._db = this.Model.db;
    this._toCollection();
  }

  /**
   * @returns {Collection}
   * @async
   */
  async getAll() {
    const data = await this._db.find({});
    if (!data) return new Collection();
    const col = new Collection();
    for (const val of data) {
      col.set(val._id, val._doc);
    }
    return col;
  }

  /**
   * @private
   */
  async _toCollection() {
    this.collection = await this.getAll();
  }

  /**
   * @property {function|object|*} query
   * @property {*} value
   * @returns {Boolean}
   * @example model.hasOne({ id: '1' });
   * @example model.hasOne(value => value.id === '1');
   * @example model.hasOne('id', '1');
   */
  hasOne(query, value) {
    return !!this.collection.find(query, value);
  }

  /**
   * @property {function|object|*} query
   * @property {*} value
   * @returns {*}
   * @example model.findOne({ id: '1' });
   * @example model.findOne(value => value.id === '1');
   * @example model.findOne('id', '1');
   */
  findOne(query, value) {
    const data = this.collection.find(query, value);
    return data ? { ...this.defaults, ...data } : this.defaults;
  }

  /**
   * @property {*} data
   * @returns {*} data
   * @example model.insertOne({ id: '1' });
   */
  insertOne(data) {
    if (typeof data !== 'object') {
      const text = `First argument must be an object. Instead got ${typeof data}`;
      throw new TypeError(text);
    }
    data = { ...this.defaults, ...data };
    if (!data._id) data._id = new mongoose.mongo.ObjectID();
    const col = this._db.collection(this.name);
    this.collection.set(data._id, data);
    col.insertOne(data);
    return data;
  }

  /**
   * @property {function|object|*} query
   * @property {*} value
   * @returns {*} Deleted data.
   * @example model.deleteOne({ id: '1' });
   */
  deleteOne(query, value) {
    if (typeof query === 'string') {
      if (typeof value === 'undefined') {
        const text = 'Value must be specified.';
        throw new Error(text);
      }
      const prop = query;
      query = {};
      query[prop] = value;
    }
    if (typeof query !== 'object' && typeof query !== 'function') {
      const text = `First argument must be an object, function or string. Instead got ${typeof query}.`;
      throw new TypeError(text);
    }
    if (!this.hasOne(query)) return null;
    const data = this.findOne(query);
    if (!data) return null;
    this.collection.delete(data._id);
    const col = this._db.collection(this.name);
    col.deleteOne({ _id: data._id });
    return data;
  }

  /**
   * @property {function|object|*} query
   * @property {*} value Value or data.
   * @property {*} newData
   * @returns {*} Updated data.
   * @example model.updateOne({ id: '1' }, { id: '2' });
   * @example model.updateOne(value => value.id === '1', { id: '2' });
   * @example model.updateOne('id', '1', { id: '2' });
   */
  updateOne(query, value, newData) {
    if (typeof query === 'string') {
      if (typeof value === 'undefined') {
        const text = 'Value must be specified.';
        throw new Error(text);
      }
      const prop = query;
      query = {};
      query[prop] = value;
      value = newData;
    }
    if (typeof value !== 'object') {
      const text = `Data must be an object. Instead got ${typeof value}`;
      throw new TypeError(text);
    }
    if (typeof query !== 'object' && typeof query !== 'function') {
      const text = `First argument must be an object, function or string. Instead got ${typeof query}`;
      throw new TypeError(text);
    }
    if (!this.hasOne(query)) return null;
    const data = this.findOne(query);
    this.collection.set(data._id, value);
    const col = this._db.collection(this.name);
    col.updateOne({ _id: data._id }, { $set: value });
    return value;
  }

  /**
   * @property {function|object|*} query
   * @property {*} value Value or data.
   * @property {*} newData
   * @returns {*} Updated / Inserted data.
   * @example model.upsertOne({ id: '1' }, { id: '2' });
   * @example model.upsertOne(value => value.id === '1', { id: '2' });
   * @example model.upsertOne('id', '1', { id: '2' });
   */
  upsertOne(query, value, newData) {
    const updated = this.updateOne(query, value, newData);
    if (updated) return updated;
    if (typeof query === 'function') query = {};
    if (typeof query === 'string') {
      if (typeof value === 'undefined') {
        const text = 'Value must be specified.';
        throw new Error(text);
      }
      const prop = query;
      query = {};
      query[prop] = value;
      value = newData;
    }
    this.insertOne({ ...this.defaults, ...query, ...value });
    return { ...this.defaults, ...query, ...value };
  }
};
