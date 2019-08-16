const { Client } = require('discord.js');
const path = require('path');
const Store = require('./Store');
const PermissionLevels = require('./PermissionLevels');
const Collection = require('../util/Collection');
const DB = require('./DB');
const UniqueId = require('../util/UniqueId');
const Config = require('./Config');

const defaultOptions = {
  eventsFolder: 'events',
  commandsFolder: 'commands',
  token: null,
  prefix: undefined,
  splitArgs: ' ',
  ignoreCase: true,
  permLevels: new PermissionLevels(),
  ignoreBots: true,
  ignoreSelf: true,
  db: null,
};

/**
 * @extends {DiscordClient}
 */
module.exports = class extends Client {
  constructor(options = {}) {
    options = { ...defaultOptions, ...options };
    const thisOptions = {
      eventsFolder: options.eventsFolder,
      commandsFolder: options.commandsFolder,
      token: options.token,
      prefix: options.prefix,
      splitArgs: options.splitArgs,
      ignoreCase: options.ignoreCase,
      permLevels: options.permLevels,
      ignoreBots: options.ignoreBots,
      ignoreSelf: options.ignoreSelf,
      db: options.db,
    };
    delete options.eventsFolder;
    delete options.commandsFolder;
    delete options.token;
    delete options.prefix;
    delete options.splitArgs;
    delete options.ignoreCase;
    delete options.permLevels;
    delete options.ignoreBots;
    delete options.ignoreSelf;
    delete options.db;
    super(options);
    const { prefix, splitArgs, db } = thisOptions;
    if (
      db !== undefined &&
      db !== null &&
      (typeof db !== 'object' || !(db instanceof DB))
    ) {
      const err = 'Db property must be instance of DB.';
      throw new Error(err);
    }
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
      typeof splitArgs.test !== 'function'
    ) {
      throw new TypeError(
        'SplitArgs option must be a string, undefined, null or regular expression.'
      );
    }
    this.public = {};
    /**
     * @name Core#_private
     * @type {Object}
     * @private
     */
    this._private = {};
    this._private.sentPages = new Collection();
    this._private.eventsFolder = thisOptions.eventsFolder;
    this._private.commandsFolder = thisOptions.commandsFolder;
    this._private.fullpath = require.main.filename;
    this._private.filepath = path.basename(require.main.filename);
    this._private.dirpath = path.dirname(require.main.filename);
    this.config = {};
    this.config.guild = new Config(this, thisOptions);
    this.prefix = thisOptions.prefix;
    this.splitArgs = thisOptions.splitArgs;
    this.ignoreCase = thisOptions.ignoreCase;
    this.permLevels = thisOptions.permLevels;
    this.ignoreBots = thisOptions.ignoreBots;
    this.ignoreSelf = thisOptions.ignoreSelf;
    this.db = thisOptions.db;
    this.uniqid = new UniqueId();

    if (this.db && this.db.connection) {
      this.db.connection.on('connected', () =>
        this.emit('dbConnected', this.db)
      );
      this.db.connection.on('err', err => this.emit('dbError', err));
      this.db.connection.on('disconnected', () =>
        this.emit('dbDisconnected', this.db)
      );
    }

    new Store(this, 'event', path.join(__dirname, '../events'));
    new Store(this, 'command');

    if (thisOptions.token) this.login(thisOptions.token);
  }
};
