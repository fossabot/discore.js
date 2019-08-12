let _symbols = '';
// _symbols = `${_symbols}abcdefghijklmnopqrstuvwxyz`;
// _symbols = `${_symbols}${_symbols.toUpperCase()}`;
_symbols = `${_symbols}0123456789`;

const symbols = _symbols.split('');

module.exports = class UniqueId {
  constructor(ids) {
    this.ids = new Set(ids);
  }

  remove(id) {
    if (!this.ids.has(id)) return null;
    this.ids.delete(id);
    return id;
  }

  delete(...args) {
    return this.remove(...args);
  }

  gen(length = 16) {
    let id = null;
    while (!id || this.ids.has(id)) id = this._genId(length);
    this.ids.add(id);
    return id;
  }

  generate(...args) {
    return this.gen(...args);
  }

  generateId(...args) {
    return this.gen(...args);
  }

  genId(...args) {
    return this.gen(...args);
  }

  _genId(length) {
    let id = '';
    for (let i = 0; i < length; i++) {
      id = `${id}${symbols[Math.floor(Math.random() * symbols.length)]}`;
    }
    return id;
  }
};
