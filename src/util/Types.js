const mongoose = require('mongoose');

const Types = {
  Number() {
    const mongoType = Number;
    return { mongoType, db: ['mongo'] };
  },

  Double(limit = null, ...args) {
    const primary = args.indexOf('PRIMARY');
    if (primary >= 0) args.splice(primary, 1);
    const mongoType = Number;
    const mySqlType = `DOUBLE${limit ? `(${limit})` : ''}${
      args.length > 0 ? ` ${args.join(' ')}` : ''
    }`;
    return {
      mySqlType,
      mongoType,
      db: ['mongo', 'mysql'],
      primary: primary >= 0,
    };
  },

  String() {
    return { mongoType: String, db: ['mongo'] };
  },

  Object() {
    return { mongoType: Object, db: ['mongo'] };
  },

  Array() {
    return { mongoType: Array, db: ['mongo'] };
  },

  ObjectId() {
    return { mongoType: mongoose.Schema.Types.ObjectId, db: ['mongo'] };
  },

  Boolean(...args) {
    const primary = args.indexOf('PRIMARY');
    if (primary >= 0) args.splice(primary, 1);
    const mongoType = Boolean;
    const mySqlType = `BOOLEAN${args.length > 0 ? ` ${args.join(' ')}` : ''}`;
    return {
      mongoType,
      mySqlType,
      db: ['mongo', 'mysql'],
      primary: primary >= 0,
    };
  },

  Date(...args) {
    const primary = args.indexOf('PRIMARY');
    if (primary >= 0) args.splice(primary, 1);
    const mongoType = Number;
    const mySqlType = `DATE${args.length > 0 ? ` ${args.join(' ')}` : ''}`;
    return {
      mySqlType,
      mongoType,
      db: ['mongo', 'mysql'],
      primary: primary >= 0,
    };
  },

  RegExp() {
    return { mongoType: RegExp, db: ['mongo'] };
  },

  Char(limit = null, ...args) {
    const primary = args.indexOf('PRIMARY');
    if (primary >= 0) args.splice(primary, 1);
    const mySqlType = `CHAR${limit ? `(${limit})` : ''}${
      args.length > 0 ? ` ${args.join(' ')}` : ''
    }`;
    return { mySqlType, db: ['mysql'], primary: primary >= 0 };
  },

  VarChar(limit = null, ...args) {
    const primary = args.indexOf('PRIMARY');
    if (primary >= 0) args.splice(primary, 1);
    const mySqlType = `VARCHAR${limit ? `(${limit})` : ''}${
      args.length > 0 ? ` ${args.join(' ')}` : ''
    }`;
    return { mySqlType, db: ['mysql'], primary: primary >= 0 };
  },

  TinyText(limit = null, ...args) {
    const primary = args.indexOf('PRIMARY');
    if (primary >= 0) args.splice(primary, 1);
    const mySqlType = `TINYTEXT${limit ? `(${limit})` : ''}${
      args.length > 0 ? ` ${args.join(' ')}` : ''
    }`;
    return { mySqlType, db: ['mysql'], primary: primary >= 0 };
  },

  Text(limit = null, ...args) {
    const primary = args.indexOf('PRIMARY');
    if (primary >= 0) args.splice(primary, 1);
    const mySqlType = `TEXT${limit ? `(${limit})` : ''}${
      args.length > 0 ? ` ${args.join(' ')}` : ''
    }`;
    return { mySqlType, db: ['mysql'], primary: primary >= 0 };
  },

  Blob(limit = null, ...args) {
    const primary = args.indexOf('PRIMARY');
    if (primary >= 0) args.splice(primary, 1);
    const mySqlType = `BLOB${limit ? `(${limit})` : ''}${
      args.length > 0 ? ` ${args.join(' ')}` : ''
    }`;
    return { mySqlType, db: ['mysql'], primary: primary >= 0 };
  },

  MediumText(limit = null, ...args) {
    const primary = args.indexOf('PRIMARY');
    if (primary >= 0) args.splice(primary, 1);
    const mySqlType = `MEDIUMTEXT${limit ? `(${limit})` : ''}${
      args.length > 0 ? ` ${args.join(' ')}` : ''
    }`;
    return { mySqlType, db: ['mysql'], primary: primary >= 0 };
  },

  LongText(limit = null, ...args) {
    const primary = args.indexOf('PRIMARY');
    if (primary >= 0) args.splice(primary, 1);
    const mySqlType = `LONGTEXT${limit ? `(${limit})` : ''}${
      args.length > 0 ? ` ${args.join(' ')}` : ''
    }`;
    return { mySqlType, db: ['mysql'], primary: primary >= 0 };
  },

  LongBlob(limit = null, ...args) {
    const primary = args.indexOf('PRIMARY');
    if (primary >= 0) args.splice(primary, 1);
    const mySqlType = `LONGBLOB${limit ? `(${limit})` : ''}${
      args.length > 0 ? ` ${args.join(' ')}` : ''
    }`;
    return { mySqlType, db: ['mysql'], primary: primary >= 0 };
  },

  TinyInt(limit = null, ...args) {
    const primary = args.indexOf('PRIMARY');
    if (primary >= 0) args.splice(primary, 1);
    const mySqlType = `TINYINT${limit ? `(${limit})` : ''}${
      args.length > 0 ? ` ${args.join(' ')}` : ''
    }`;
    return { mySqlType, db: ['mysql'], primary: primary >= 0 };
  },

  SmallInt(limit = null, ...args) {
    const primary = args.indexOf('PRIMARY');
    if (primary >= 0) args.splice(primary, 1);
    const mySqlType = `SMALLINT${limit ? `(${limit})` : ''}${
      args.length > 0 ? ` ${args.join(' ')}` : ''
    }`;
    return { mySqlType, db: ['mysql'], primary: primary >= 0 };
  },

  MediumInt(limit = null, ...args) {
    const primary = args.indexOf('PRIMARY');
    if (primary >= 0) args.splice(primary, 1);
    const mySqlType = `MEDIUMINT${limit ? `(${limit})` : ''}${
      args.length > 0 ? ` ${args.join(' ')}` : ''
    }`;
    return { mySqlType, db: ['mysql'], primary: primary >= 0 };
  },

  Int(limit = null, ...args) {
    const primary = args.indexOf('PRIMARY');
    if (primary >= 0) args.splice(primary, 1);
    const mySqlType = `INT${limit ? `(${limit})` : ''}${
      args.length > 0 ? ` ${args.join(' ')}` : ''
    }`;
    return { mySqlType, db: ['mysql'], primary: primary >= 0 };
  },

  BigInt(limit = null, ...args) {
    const primary = args.indexOf('PRIMARY');
    if (primary >= 0) args.splice(primary, 1);
    const mySqlType = `BIGINT${limit ? `(${limit})` : ''}${
      args.length > 0 ? ` ${args.join(' ')}` : ''
    }`;
    return { mySqlType, db: ['mysql'], primary: primary >= 0 };
  },

  Float(limit = null, ...args) {
    const primary = args.indexOf('PRIMARY');
    if (primary >= 0) args.splice(primary, 1);
    const mySqlType = `FLOAT${limit ? `(${limit})` : ''}${
      args.length > 0 ? ` ${args.join(' ')}` : ''
    }`;
    return { mySqlType, db: ['mysql'], primary: primary >= 0 };
  },

  Decimal(limit = null, ...args) {
    const primary = args.indexOf('PRIMARY');
    if (primary >= 0) args.splice(primary, 1);
    const mySqlType = `DECIMAL${limit ? `(${limit})` : ''}${
      args.length > 0 ? ` ${args.join(' ')}` : ''
    }`;
    return { mySqlType, db: ['mysql'], primary: primary >= 0 };
  },

  DateTime(...args) {
    const primary = args.indexOf('PRIMARY');
    if (primary >= 0) args.splice(primary, 1);
    const mySqlType = `DATETIME${args.length > 0 ? ` ${args.join(' ')}` : ''}`;
    return { mySqlType, db: ['mysql'], primary: primary >= 0 };
  },

  Timestamp(...args) {
    const primary = args.indexOf('PRIMARY');
    if (primary >= 0) args.splice(primary, 1);
    const mySqlType = `TIMESTAMP${args.length > 0 ? ` ${args.join(' ')}` : ''}`;
    return { mySqlType, db: ['mysql'], primary: primary >= 0 };
  },

  Time(...args) {
    const primary = args.indexOf('PRIMARY');
    if (primary >= 0) args.splice(primary, 1);
    const mySqlType = `TIME${args.length > 0 ? ` ${args.join(' ')}` : ''}`;
    return { mySqlType, db: ['mysql'], primary: primary >= 0 };
  },

  Enum(...args) {
    const primary = args.indexOf('PRIMARY');
    if (primary >= 0) args.splice(primary, 1);
    const mySqlType = `ENUM${args.length > 0 ? ` ${args.join(' ')}` : ''}`;
    return { mySqlType, db: ['mysql'], primary: primary >= 0 };
  },

  Set(...args) {
    const primary = args.indexOf('PRIMARY');
    if (primary >= 0) args.splice(primary, 1);
    const mySqlType = `SET${args.length > 0 ? ` ${args.join(' ')}` : ''}`;
    return { mySqlType, db: ['mysql'], primary: primary >= 0 };
  },
};
module.exports = Types;
