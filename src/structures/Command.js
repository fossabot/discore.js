const Base = require('./Base');
const Collection = require('../util/Collection');

const defaultOptions = {
  cooldown: 0,
  aliases: [],
  permLevel: 0,
  description: undefined,
};

module.exports = class Command extends Base {
  constructor(client, fullpath, options = {}) {
    const childOptions = this.settings || this.options || {};
    if (typeof childOptions !== 'object') {
      const err = 'Options must return an object.';
      this.client.emit('error', err);
    }
    options = { ...defaultOptions, ...childOptions, ...options };
    const thisOptions = {
      cooldown: options.cooldown,
      permLevel: options.permLevel,
      description: options.description,
      aliases: options.aliases,
    };
    delete options.cooldown;
    delete options.aliases;
    delete options.permLevel;
    delete options.description;
    super(client, 'command', fullpath, options);
    if (typeof thisOptions.aliases === 'string')
      thisOptions.aliases = [thisOptions.aliases];
    if (
      typeof thisOptions.aliases !== 'object' ||
      {}.hasOwnProperty.call(thisOptions.aliases, 'some')
    ) {
      const err = 'Aliases property must be an array or string.';
      this.client.emit('error', err);
    }
    if (thisOptions.aliases.some(e => typeof e !== 'string')) {
      const err = 'Aliases must be a string.';
      this.client.emit('error', err);
    }
    this.cooldown = thisOptions.cooldown;
    this.aliases = thisOptions.aliases;
    this.permLevel = thisOptions.permLevel;
    this.description = thisOptions.description;
    this.cooldowns = new Collection();
  }

  _run(...args) {
    if (this.enabled) this.run(...args);
  }

  run() {
    const err = 'Run method must be defined';
    this.client.emit('error', err);
  }
};
