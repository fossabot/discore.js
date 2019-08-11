const objFn = {
  every(obj, fn) {
    for (const key in obj) {
      if ({}.hasOwnProperty.call(obj, key)) {
        if (!fn(obj[key], key, obj)) return false;
      }
    }
    return true;
  },
};

module.exports = class Collection extends Map {
  array() {
    return [...this.values()];
  }

  keyArray() {
    return [...this.keys()];
  }

  first(count) {
    if (count === undefined) count = 1;
    if (typeof count !== 'number') {
      const text = `The count must be a number. Instead got ${typeof count}.`;
      throw new TypeError(text);
    }
    if (count < 1 || !Number.isInteger(count)) {
      const text = `The count must be an integer greater than 0. Instead got ${count}.`;
      throw new RangeError(text);
    }
    const arr = [...this.values()];
    if (count === 1) return arr[0];
    count = Math.min(count, this.size);
    return arr.slice(0, count);
  }
  
  firstKey(count = 1) {
    if (typeof count !== 'number') {
      const text = `The count must be a number. Instead got ${typeof count}.`;
      throw new TypeError(text);
    }
    if (count < 1 || !Number.isInteger(count)) {
      const text = `The count must be an integer greater than 0. Instead got ${count}.`;
      throw new RangeError(text);
    }
    const arr = [...this.keys()];
    if (count === 1) return arr[0];
    count = Math.min(count, this.size);
    return arr.slice(0, count);
  }
  
  last(count = 1) {
    if (typeof count !== 'number') {
      const text = `The count must be a number. Instead got ${typeof count}.`;
      throw new TypeError(text);
    }
    if (count < 1 || !Number.isInteger(count)) {
      const text = `The count must be an integer greater than 0. Instead got ${count}.`;
      throw new RangeError(text);
    }
    const arr = [...this.values()];
    if (count === 1) return arr.slice(-1)[0];
    count = Math.min(count, this.size);
    return arr.slice(-count);
  }
  
  lastKey(count = 1) {
    if (typeof count !== 'number') {
      const text = `The count must be a number. Instead got ${typeof count}.`;
      throw new TypeError(text);
    }
    if (count < 1 || !Number.isInteger(count)) {
      const text = `The count must be an integer greater than 0. Instead got ${count}.`;
      throw new RangeError(text);
    }
    const arr = [...this.keys()];
    if (count === 1) return arr.slice(-1)[0];
    count = Math.min(count, this.size);
    return arr.slice(-count);
  }

  random(count = 1) {
    if (typeof count !== 'number') {
      const text = `The count must be a number. Instead got ${typeof count}.`;
      throw new TypeError(text);
    }
    if (count < 1 || !Number.isInteger(count)) {
      const text = `The count must be an integer greater than 0. Instead got ${count}.`;
      throw new RangeError(text);
    }
    const arr = [...this.values()];
    if (count === 1) return arr[Math.floor(Math.random() * arr.length)];
    count = Math.min(count, this.size);
    const newArr = [];
    for (let i = 0; i < count; i++) {
      const rand = Math.floor(Math.random() * arr.length);
      newArr.push(arr.splice(rand, 1)[0]);
    }
    return newArr;
  }

  randomKey(count = 1) {
    if (typeof count !== 'number') {
      const text = `The count must be a number. Instead got ${typeof count}.`;
      throw new TypeError(text);
    }
    if (count < 1 || !Number.isInteger(count)) {
      const text = `The count must be an integer greater than 0. Instead got ${count}.`;
      throw new RangeError(text);
    }
    const arr = [...this.keys()];
    if (count === 1) return arr[Math.floor(Math.random() * arr.length)];
    count = Math.min(count, this.size);
    const newArr = [];
    for (let i = 0; i < count; i++) {
      const rand = Math.floor(Math.random() * arr.length);
      newArr.push(arr.splice(rand, 1)[0]);
    }
    return newArr;
  }

  findAll(query, value) {
    if (typeof query === 'string') {
      if (typeof value === 'undefined') {
        const text = 'Value must be specified.';
        throw new Error(text);
      }
      const prop = {};
      prop[query] = value;
      query = prop;
    }
    const arr = [];
    if (typeof query === 'function') {
      for (const [key, val] of this) {
        if (query(val, key, this)) arr.push(val);
      }
    } else if (typeof query === 'object') {
      for (const val of this.values()) {
        if (objFn.every(query, (value, key) => value === val[key])) {
          arr.push(val);
        }
      }
    } else {
      const text = `First argument must be an object, function or string. Instead got ${typeof query}`;
      throw new TypeError(text);
    }
    return arr;
  }

  find(query, value) {
    if (typeof query === 'string') {
      if (typeof value === 'undefined') {
        const text = 'Value must be specified';
        throw new Error(text);
      }
      const prop = {};
      prop[query] = value;
      query = prop;
    }
    if (typeof query === 'function') {
      for (const [key, val] of this) {
        if (query(val, key, this)) return val;
      }
    } else if (typeof query === 'object') {
      for (const val of this.values()) {
        if (objFn.every(query, (value, key) => value === val[key])) {
          return val;
        }
      }
    } else {
      const text = `First argument must be a function, object or string. Instead got ${typeof query}.`;
      throw new TypeError(text);
    }
    return null;
  }

  findKey(query, value) {
    if (typeof query === 'string') {
      if (typeof value === 'undefined') {
        const text = 'Value must be specified';
        throw new Error(text);
      }
      const prop = {};
      prop[query] = value;
      query = prop;
    }
    if (typeof query === 'function') {
      for (const [key, val] of this) {
        if (query(val, key, this)) return key;
      }
    } else if (typeof query === 'object') {
      for (const [key, val] of this) {
        if (objFn.every(query, (value, key) => value === val[key])) {
          return key;
        }
      }
    } else {
      const text = `First argument must be a function, object or string. Instead got ${typeof query}.`;
      throw new TypeError(text);
    }
    return null;
  }

  exists(query, value) {
    return !!this.find(query, value);
  }

  sweep(fn, thisArg) {
    if (thisArg) fn = fn.bind(thisArg);
    const size = this.size;
    for (const [key, val] of this) {
      if (fn(val, key, this)) this.delete(key);
    }
    return size - this.size;
  }

  filter(fn, thisArg) {
    if (thisArg) fn = fn.bind(thisArg);
    const col = new this.constructor();
    for (const [key, val] of this) {
      if (fn(val, key, this)) col.set(key, val);
    }
    return col;
  }

  filterArray(fn, thisArg) {
    if (thisArg) fn = fn.bind(thisArg);
    const arr = [];
    for (const [key, val] of this) {
      if (fn(val, key, this)) arr.push(val);
    }
    return arr;
  }

  partition(fn, thisArg) {
    if (thisArg) fn = fn.bind(thisArg);
    const arr = [new this.constructor(), new this.constructor()];
    for (const [key, val] of this) {
      if (fn(val, key, this)) arr[0].set(key, val);
      else arr[1].set(key, val);
    }
    return arr;
  }

  map(fn, thisArg) {
    if (thisArg) fn = fn.bind(thisArg);
    const arr = [];
    for (const [key, val] of this) {
      arr.push(fn(val, key, this));
    }
    return arr;
  }

  mapCol(fn, thisArg) {
    if (thisArg) fn = fn.bind(thisArg);
    const col = new this.constructor();
    for (const [key, val] of this) {
      col.set(key, fn(val, key, this));
    }
    return col;
  }

  some(fn, thisArg) {
    if (thisArg) fn = fn.bind(thisArg);
    for (const [key, val] of this) {
      if (fn(val, key, this)) return true;
    }
    return false;
  }

  every(fn, thisArg) {
    if (thisArg) fn = fn.bind(thisArg);
    for (const [key, val] of this) {
      if (!fn(val, key, this)) return false;
    }
    return true;
  }

  reduce(fn, accumulator) {
    if (typeof accumulator !== 'undefined' && typeof accumulator !== 'number') {
      const text = `Second argument must be a number. Instead got ${typeof accumulator}.`;
      throw new TypeError(text);
    }
    for (const [key, val] of this) {
      if (!accumulator) accumulator = val;
      else accumulator = fn(accumulator, val, key, this);
    }
    return accumulator;
  }

  tap(fn, thisArg) {
    this.forEach(fn, thisArg);
    return this;
  }

  clone() {
    return new this.constructor(this);
  }

  concat(...collections) {
    const col = new this.constructor(this);
    for (const collection of collections) {
      for (const [key, val] of collection) col.set(key, val);
    }
    return col;
  }

  deleteAll() {
    const deleted = [];
    for (const [key, val] of this) {
      deleted.push(val);
      this.delete(key);
    }
    return deleted;
  }

  equals(...collections) {
    for (const collection of collections) {
      if (!collection) return false;
      if (this === collection) return true;
      if (this.size !== collection.size) return false;
      return !this.find((value, key) => {
        const testVal = collection.get(key);
        return testVal !== value || (testVal === undefined && !collection.has(key));
      });
    }
  }

  sort(compareFunction = (x, y) => +(x > y) || +(x === y) - 1) {
    const entries = [...this.entries].sort((a, b) => compareFunction(a[1], b[1], a[0], b[0]));
    const col = new this.constructor(entries);
    return col;
  }
};
