const Collection = require('../util/Collection');

const settings = [
  'prefix',
  'splitArgs',
  'ignoreCase',
  'permLevels',
  'ignoreSelf',
  'ignoreBots',
];

module.exports = class Config extends Collection {
  constructor(client, defaults) {
    super();
    this.client = client;
    for (const key in defaults) {
      if ({}.hasOwnProperty.call(defaults, key)) {
        if (!settings.includes(key)) delete defaults[key];
      }
    }
    this.defaults = defaults;
  }

  set(key, value) {
    if (!key || typeof key !== 'string') {
      throw new TypeError('Key argument must be a string.');
    }
    if (typeof value !== 'object') {
      throw new TypeError('Value option must be an object.');
    }
    const { prefix, splitArgs } = value;
    if (prefix === undefined) value.prefix = '';
    if (typeof prefix === 'object' && !{}.hasOwnProperty.call(prefix, 'test')) {
      const err = 'Prefix option must be a string or regular expression.';
      throw new TypeError(err);
    }
    if (
      splitArgs !== undefined &&
      splitArgs !== null &&
      splitArgs !== 'string' &&
      splitArgs !== 'object' &&
      typeof splitArgs === 'object' &&
      typeof splitArgs.test !== 'function'
    ) {
      throw new TypeError(
        'SplitArgs option must be a string, undefined, null or regular expression.'
      );
    }
    return super.set(key, { ...this.defaults, ...value, _settingKey: key });
  }

  get(key) {
    if (!key) return this.defaults;
    return this.find(e => e._settingKey === key) || this.defaults;
  }
};
