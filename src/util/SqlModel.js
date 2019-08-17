const Collection = require('./Collection');
const UniqueId = require('./UniqueId');

module.exports = class SQLModel {
  constructor(db, name, options = {}, defaults = {}) {
    if (typeof name !== 'string') {
      const text = `First argument must be a string. Instead got ${typeof name}`;
      throw new TypeError(text);
    }
    name = name.toLowerCase();
    this.db = db;
    this.uniqid = new UniqueId();
    this.defaults = defaults;
    this.name = name;
    const tableOptions = [];
    options = { ...this.defaults, ...options };
    for (const key in options) {
      if ({}.hasOwnProperty.call(options, key)) {
        tableOptions.push({ key, name: key, type: options[key] });
      }
    }
    this.db.query(
      `IF NOT EXISTS (SELECT * FROM INFROMATION_SCHEMA.TABLES WHERE TABLE_NAME = '${
        this.name
      }') BEGIN CREATE TABLE ${this.name} (${tableOptions
        .map(e => `${e.key} ${e.type}`)
        .join(', ')}) END`
    );
    this.collection = new Collection();
    this._toCollection();
  }

  /**
   * @returns {Collection}
   * @async
   */
  async getAll() {
    const col = new Collection();
    const data = new Promise((res, rej) => {
      this.db
        .query(`SELECT * FROM ${this.name}`)
        .on('result', doc => res(doc))
        .on('error', err => rej(err));
    });
    try {
      await data;
    } catch (err) {
      throw new Error(err);
    }
    if (!data) return col;
    for (const val of data) {
      col.set(val._id, val);
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
    if (data && data._id) data._id = data._id;
    return data ? { ...this.defaults, ...data } : this.defaults;
  }

  /**
   * @property {*} data
   * @returns {*} data
   * @example model.insertOne({ id: '1' });
   * @async
   */
  insertOne(data) {
    if (typeof data !== 'object') {
      const text = `First argument must be an object. Instead got ${typeof data}`;
      throw new TypeError(text);
    }
    data = { ...this.defaults, ...data };
    if (!data._id) data._id = this.uniqid.gen();
    this.collection.set(data._id, data);
    const insertData = [];
    for (const key in data) {
      if ({}.hasOwnProperty.call(data, key)) {
        insertData.push({ key, value: data[key], name: key });
      }
    }
    return new Promise((res, rej) => {
      this.db
        .query(
          `INSERT INTO ${this.name} (${insertData
            .map(e => `\`${e.key}\``)
            .join(', ')}) VALUES (${insertData
            .map(e => `'${e.value}'`)
            .join(', ')})`
        )
        .on('error', err => rej(err))
        .on('result', () => res(data));
    });
  }

  /**
   * @property {function|object|*} query
   * @property {*} value
   * @returns {*} Deleted data.
   * @example model.deleteOne({ id: '1' });
   * @async
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
    this.collection.delete(data._id.toHexString());
    return new Promise((res, rej) => {
      this.db
        .query(`DELETE FROM ${this.name} WHERE _id = '${data._id}'`)
        .on('result', () => res(data))
        .on('error', err => rej(err));
    });
  }

  /**
   * @property {function|object|*} query
   * @property {*} value Value or data.
   * @property {*} newData
   * @returns {*} Updated data.
   * @example model.updateOne({ id: '1' }, { id: '2' });
   * @example model.updateOne(value => value.id === '1', { id: '2' });
   * @example model.updateOne('id', '1', { id: '2' });
   * @async
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
    this.collection.set(data._id.toHexString(), {
      ...data,
      ...value,
      _id: data._id.toHexString(),
    });
    const updateData = [];
    for (const key in value) {
      if ({}.hasOwnProperty.call(value, key)) {
        updateData.push({ key, name: key, value: value[key] });
      }
    }
    return new Promise((res, rej) => {
      this.db
        .query(
          `UPDATE ${this.name} SET ${updateData
            .map(e => `${e.key} = ${e.value}`)
            .join(', ')} WHERE _id = '${data._id}'`
        )
        .on('result', () => res(data))
        .on('error', err => rej(err));
    });
  }

  /**
   * @property {function|object|*} query
   * @property {*} value Value or data.
   * @property {*} newData
   * @returns {*} Updated / Inserted data.
   * @example model.upsertOne({ id: '1' }, { id: '2' });
   * @example model.upsertOne(value => value.id === '1', { id: '2' });
   * @example model.upsertOne('id', '1', { id: '2' });
   * @async
   */
  async upsertOne(query, value, newData) {
    const updated = await this.updateOne(query, value, newData);
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
    await this.insertOne({ ...query, ...value });
    return { ...this.defaults, ...query, ...value };
  }
};
