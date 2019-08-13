<div align="center">
  <p>
    <div>
      <a href="https://www.npmjs.com/package/discore.js">
        <img src="https://img.shields.io/npm/v/discore.js.svg" alt="NPM Version">
      </a>
      <a href="https://www.npmjs.com/package/discore.js">
        <img src="https://img.shields.io/npm/dt/discore.js.svg" alt="NPM Downloads">
      </a>
    </div>
    <div>
      <a href="https://david-dm.org/zargovv/discore.js">
        <img src="https://img.shields.io/david/zargovv/discore.js.svg" alt="Dependencies" />
      </a>
      <a href="https://travis-ci.org/zargovv/discore.js.svg">
        <img src="https://travis-ci.org/zargovv/discore.js.svg" alt="Build Status">
      </a>
    </div>
  </p>
  <p>
    <a href="https://nodei.co/npm/discore.js/">
      <img src="https://nodei.co/npm/discore.js.png?downloads=true&stars=true">
    </a>
  </p>
</div>

###### Based on discord.js

## Examples

`index.js` structure:

```js
const { Core } = require('discore.js');
new Core({
  // options
}).login('token');
```

- Alternate login system

```js
const { Core } = require('discore.js');
new Core({
  token: 'token',
});
```

- All options (defaults)

```js
const { Core } = require('discore.js');
new Core({
  typing: false,
  eventsFolder: 'events',
  commandsFolder: 'commands',
  token: null,
  prefix: undefined,
  splitArgs: ' ',
  cmdsIn: ['text'],
  ignoreCase: true,
  permLevels: new PermissionLevels(),
  ignoreSelf: true,
  ignoreBots: true,
  db: new DB(),
});
```

#### Methods:

- `uniqid.gen()` // Generates unique identificator

### Events

Events are placed in `.\events\`(**eventsFolder** option).
For instance creating `.\events\Main\ready.js` will be an event `ready` in the `Main` category. Subcategories are also allowed and gonna be a second and more folder levels.

Their structure (options argument defined with default configuration):

```js
const { Event } = require('discore.js');

module.exports = class extends Event {
  get options() {
    return {
      enabled: true,
      key: null, // Same as name but more important.
      name: null, // Key is going to be event name.
      once: false,
    };
    // If key and name are null then they will be defined as file name.
    // For example, ready.js is gonna be 'ready'
  }

  run(...params) {
    // Event code.
    // Runs only if enabled.
  }

  disabledRun(...params) {
    // Same as run but runs only if disabled.
  }

  init() {
    // Optional method. Runs on 'ready'
    // event so you are able to use discord
    // data via this.client.
  }
};
```

#### Methods:

- `toggle()`
- `enable()`
- `disable()`
- `unload()`
- `reload()`
- `toString()`

#### Included events:

- Command Handler

### Commands

Commands are placed in `.\commands\` (**commandsFolder** option).
For instance creating `.\events\Main\Command.js` will be a command `Command` in the `Main` category. Subcategories are also allowed and gonna be a second and more folder levels.

Their structure (options argument defined with default configuration):

```js
const { Command } = require('discore.js');

module.exports = class extends Command {
  get options() {
    return {
      enabled: true,
      key: null, // Same as name but more important.
      name: null, // Key is going to be command name.
      cooldown: 0, // In milliseconds
      aliases: [],
      permLevel: 0,
      description: undefined,
    };
    // If key and name are null then they will be defined as file name.
    // For example, test.js is gonna be 'test'
  }

  run(...params) {
    // Command code.
    // Runs only if enabled.
  }

  disabledRun(...params) {
    // Same as run but runs only if disabled.
  }

  init() {
    // Optional method. Runs on 'ready'
    // event so you are able to use discord
    // data via this.client.
  }
};
```

#### Methods:

- `toggle()`
- `enable()`
- `disable()`
- `unload()`
- `reload()`
- `toString()`

### Store

Do you want to load event or command in live mode?
You can use load() method!

`.\` is gonna be your main file's root folder.

```js
this.client.events.load('./events/event');
this.client.commands.load('./commands/command');
```

#### Methods:

- `load()`

### Permission Levels

Their structure:

```js
const { Core, PermissionLevels } = require('discore.js');
const config = require('./config');

const permLevels = new PermissionLevels();
permLevels
  .add(0, true, msg => msg.author.id === '1') // Throws error.
  // Permissions Level 1 is true only if message author id is '1'
  .add(1, false, msg => msg.author.id === '1')
  // Same as previus example
  .addLevel(2, false, msg => msg.author.id === '1');

// Test for a role.
permLevels.add(3, true, msg => msg.member.roles.has('roleid'));

// Testing. Returns boolean.
permLevels.test(3, msg);

new Core(config);
```

#### Methods:

- `addLevel()`
- `add()`
- `test()`

#### Properties:

- `length`

### Embed ( RichEmbed )

Their structure:

```js
const { Embed } = require('discore.js');

const embed = new Embed()
  .addBlankField()
  .addField('Title', 'Description')
  .attachFile(file)
  .attachFiles(files)
  .setAuthor('author', 'image url')
  .setColor(color)
  .setDescription('description')
  .setFooter('footer', 'image url')
  .setImage('image url')
  .setThumbnail('image url')
  .setTimestamp()
  .setTitle('title')
  .setURL('url');
```

#### Methods:

- `addBlankField()`
- `addField()`
- `attachFile()`
- `attachFiles()`
- `setAuthor()`
- `setColor()`
- `setDescription()`
- `setFooter()`
- `setImage()`
- `setThumbnail()`
- `setTimestamp()`
- `setTitle()`
- `setURL()`

#### Properties:

- `author`
- `color`
- `description`
- `fields`
- `file`
- `files`
- `footer`
- `image`
- `length`
- `thumbnail`
- `timestamp`
- `title`
- `url`

### Database

DB's structure (options argument defined with default configuration):

```js
const { Core, DB } = require('discore.js');

const db = new DB('url', {
  /* Options */
});

new Core({
  db,
});
```

#### Methods:

- `addModel()`

#### Properties:

- `collection`

### Models ( DB )

Their structure (options argument defined with default configuration):

```js
// Must define all default properties.
// You can leave properties as undefined.
const data = {
  id: { type: String, default: undefined },
  messageCount: { type: Number, default: 0 },
};

// Model name can not contain spaces in it
db.addModel('modelName', data);
```

#### Methods:

- `hasOne()`
- `findOne()`
- `insertOne()`
- `deleteOne()`
- `updateOne()`
- `upsertOne()`

##### hasOne()

```js
// Working with model from previus example.
// You can use `db['Modelname']`

// Searches for document with `id` of '123'.
let res1 = db.Modelname.hasOne({ id: '123' });
let res2 = db.Modelname.hasOne('id', '123'); // Same.
let res3 = db.Modelname.hasOne(val => val.id === '123'); // Same.

console.log(typeof res); // Returns true or false (Boolean).
console.log(typeof res2); // Same.
console.log(typeof res3); // Same.
```

##### findOne()

```js
// Working with model from previus example.
// You can use `db['Modelname']` or `db.Modelname`

// Searches for document with `id` of '123'.
let res1 = db.Modelname.findOne({ id: '123' });
let res2 = db.Modelname.findOne('id', '123'); // Same.
let res3 = db.Modelname.findOne(val => val.id === '123'); // Same.

/*
  Returns document. If there is no document
  then you will getdefault settings which
  were defined by yourself.

  That means you can not get undefined or
  null.
*/
console.log(typeof res);
console.log(typeof res2); // Same.
console.log(typeof res3); // Same.
```

##### insertOne()

```js
// **upsertOne() method is recommended to use!**
db.Modelname.insertOne({
  id: '3213',
  messageCount: 1, // If not defined, going to be 0.
});
```

##### deleteOne()

```js
// returns null or document.
db.Modelname.deleteOne({ id: '3213' });

/*
  Does the same thing but returns null
  because document is already deleted.
*/
db.Modelname.deleteOne('id', '3212');

// Same as previus example.
db.Modelname.deleteOne(val => val.id === '3212');
```

##### updateOne()

```js
// **upsertOne() method is recommended to use!**

/*
  All of these examples are going to search
  for `id` of '3213' and update 
*/
db.Modelname.updateOne({ id: '3213' }, { messageCount: 2 });
db.Modelname.updateOne('id', '3212', { messageCount: 2 });
db.Modelname.updateOne(val => val.id === '3212', { messageCount: 2 });
```

##### upsertOne()

```js
/*
  upsertOne() method is trying to update
  a document. If document is not exists then
  is going to insert it.
*/

// All of these examples are going to search
// for `id` of '3213' and update
// messageCount to 2.
db.Modelname.upsertOne({ id: '3213' }, { messageCount: 2 });
db.Modelname.upsertOne('id', '3212', { messageCount: 2 });
db.Modelname.upsertOne(val => val.id === '3212', { messageCount: 2 });
```
