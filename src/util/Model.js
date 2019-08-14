const mongoose = require('mongoose');
const Collection = require('./Collection');

module.exports = class Model {
  constructor(name, options = {}, defaults = {}) {
    if (typeof name !== 'string') {
      const text = `First argument must be a string. Instead got ${typeof name}`;
      throw new TypeError(text);
    }
    name = name.toLowerCase();

    this._defaults = defaults;
    this._name = name;
    this.collection = new Collection();
    this._Schema = new mongoose.Schema(options);
    this._Model = mongoose.model(name, this._Schema);
  }

  async getAll() {
    const data = await this._Model.find({});
    if (!data) return new Collection();
    const col = new Collection();
    for (const val of data) {
      col.set(val._id, val._doc);
    }
    return col;
  }

  async _toCollection() {
    this.collection = await this.getAll();
  }

  hasOne(query, value) {
    return !!this.collection.find(query, value);
  }

  findOne(query, value) {
    const data = this.collection.find(query, value);
    return data ? { ...this._defaults, ...data } : this._defaults;
  }

  insertOne(data) {
    if (typeof data !== 'object') {
      const text = `First argument must be an object. Instead got ${typeof data}`;
      throw new TypeError(text);
    }
    data = { ...this._defaults, ...data };
    if (!data._id) data._id = new mongoose.mongo.ObjectID();
    const col = mongoose.connection.collection(this._name);
    this.collection.set(data._id, data);
    col.insertOne(data);
  }

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
    const col = mongoose.connection.collection(this._name);
    col.deleteOne({ _id: data._id });
    return data;
  }

  updateOne(query, dataOrValue, newData) {
    if (typeof query === 'string') {
      if (typeof dataOrValue === 'undefined') {
        const text = 'Value must be specified.';
        throw new Error(text);
      }
      const prop = query;
      query = {};
      query[prop] = dataOrValue;
      dataOrValue = newData;
    }
    if (typeof dataOrValue !== 'object') {
      const text = `Data must be an object. Instead got ${typeof dataOrValue}`;
      throw new TypeError(text);
    }
    if (typeof query !== 'object' && typeof query !== 'function') {
      const text = `First argument must be an object, function or string. Instead got ${typeof query}`;
      throw new TypeError(text);
    }
    if (!this.hasOne(query)) return null;
    const data = this.findOne(query);
    this.collection.set(data._id, {
      ...this._defaults,
      ...data,
      ...dataOrValue,
    });
    this._Model.updateOne({ _id: data._id }, { $set: dataOrValue });
    return true;
  }

  upsertOne(query, dataOrValue, newData) {
    const updated = this.updateOne(query, dataOrValue, newData);
    if (updated) return true;
    if (typeof query === 'function') query = {};
    if (typeof query === 'string') {
      if (typeof dataOrValue === 'undefined') {
        const text = 'Value must be specified.';
        throw new Error(text);
      }
      const prop = query;
      query = {};
      query[prop] = dataOrValue;
      dataOrValue = newData;
    }
    this.insertOne({ ...query, ...dataOrValue });
  }
};
