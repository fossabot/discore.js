const Event = require('../structures/Event');

module.exports = class extends Event {
  constructor(...args) {
    super(...args, {
      key: 'message',
    });
  }

  run(message) {
    if (!message) return;
    if (!message.channel) return;
    const { cmdsIn, ignoreCase, prefix, splitArgs, cmdLowerCase } = this.client;
    if (!cmdsIn.includes(message.channel.type)) return;
    let { content } = message;
    if (ignoreCase) content = content.toLowerCase();
    let matched = prefix;
    if (typeof prefix === 'string') {
      if (!content.startsWith(prefix)) return;
    } else {
      matched = content.match(prefix);
      if (!matched) return;
      matched = matched[0].length;
    }
    let args = message.content;
    if (splitArgs) args = args.split(splitArgs);
    let cmd = args.shift().slice(matched.length);
    if (cmdLowerCase) cmd = cmd.toLowerCase();
    const filter = e => e.key === cmd || e.aliases.includes(cmd);
    const command = this.client.commands.find(filter);
    if (!command) return;
    command._run(message, args);
  }
};
