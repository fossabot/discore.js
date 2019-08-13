const { Client } = require('discord.js');
const path = require('path');
const Store = require('./Store');
const PermissionLevels = require('./PermissionLevels');
const DB = require('./DB');
const UniqueId = require('../util/UniqueId');

const defaultOptions = {
  typing: false,
  eventsFolder: 'events',
  commandsFolder: 'commands',
  token: null,
  prefix: undefined,
  splitArgs: ' ',
  cmdsIn: ['text'],
  ignoreCase: true,
  permLevels: new PermissionLevels(),
  ignoreBots: true,
  ignoreSelf: true,
  db: new DB(),
};

/**
 * @extends {DiscordClient}
 */
module.exports = class extends Client {
  constructor(options = {}) {
    options = { ...defaultOptions, ...options };
    const thisOptions = {
      typing: options.typing,
      eventsFolder: options.eventsFolder,
      commandsFolder: options.commandsFolder,
      token: options.token,
      prefix: options.prefix,
      splitArgs: options.splitArgs,
      cmdsIn: options.cmdsIn,
      ignoreCase: options.ignoreCase,
      permLevels: options.permLevels,
      ignoreBots: options.ignoreBots,
      ignoreSelf: options.ignoreSelf,
      db: options.db,
    };
    delete options.typing;
    delete options.eventsFolder;
    delete options.commandsFolder;
    delete options.token;
    delete options.prefix;
    delete options.splitArgs;
    delete options.cmdsIn;
    delete options.ignoreCase;
    delete options.permLevels;
    delete options.ignoreBots;
    delete options.ignoreSelf;
    delete options.db;
    super(options);
    const { cmdsIn, prefix, splitArgs, db } = thisOptions;
    if (!(db instanceof DB)) {
      const err = 'Db option must be instance of DB.';
      throw new Error(err);
    }
    if (
      (cmdsIn !== undefined &&
        typeof cmdsIn !== 'string' &&
        typeof cmdsIn !== 'object') ||
      {}.hasOwnProperty.call(cmdsIn, 'join')
    ) {
      const err = 'CmdsIn option must be undefined, string or array.';
      throw new TypeError(err);
    }
    if (cmdsIn === undefined) thisOptions.cmdsIn = [];
    if (typeof cmdsIn === 'string') thisOptions.cmdsIn = [cmdsIn];
    if (prefix === undefined) thisOptions.prefix = '';
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
      !{}.hasOwnProperty.call(splitArgs, 'test')
    ) {
      const err =
        'SplitArgs option must be a string, undefined, null or regular expression.';
      throw new TypeError(err);
    }
    this.public = {};
    /**
     * @name Core#_private
     * @type {Object}
     * @private
     */
    this._private = {};
    this._private.typing = thisOptions.typing;
    this._private.eventsFolder = thisOptions.eventsFolder;
    this._private.commandsFolder = thisOptions.commandsFolder;
    this._private.fullpath = require.main.filename;
    this._private.filepath = path.basename(require.main.filename);
    this._private.dirpath = path.dirname(require.main.filename);
    this.prefix = thisOptions.prefix;
    this.splitArgs = thisOptions.splitArgs;
    this.cmdsIn = thisOptions.cmdsIn;
    this.ignoreCase = thisOptions.ignoreCase;
    this.permLevels = thisOptions.permLevels;
    this.ignoreBots = thisOptions.ignoreBots;
    this.ignoreSelf = thisOptions.ignoreSelf;
    this.db = thisOptions.db;
    this.uniqid = new UniqueId();

    new Store(this, 'event', path.join(__dirname, '../events'));
    new Store(this, 'command');

    if (thisOptions.token) this.login(thisOptions.token);
  }
};
