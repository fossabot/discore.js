const Event = require('../structures/Event');

module.exports = class extends Event {
  get options() {
    return {
      key: 'message',
    };
  }

  async run(message) {
    if (!message) return;
    if (!message.channel) return;
    if (!message.author) return;
    const {
      ignoreCase,
      prefix,
      splitArgs,
      ignoreBots,
      ignoreSelf,
    } = this.client.config.guild.get(message.guild ? message.guild.id : null);
    if (ignoreBots && message.author.bot) return;
    if (ignoreSelf && message.author.id === this.client.user.id) return;
    let { content } = message;
    if (ignoreCase) content = content.toLowerCase();
    let matched = prefix;
    if (typeof prefix === 'string') {
      if (!content.startsWith(prefix)) return;
    } else {
      matched = content.match(prefix);
      if (!matched) return;
      matched = matched[0];
    }
    let args = message.content.slice(matched.length);
    if (splitArgs) args = args.split(splitArgs);
    let cmd = args.shift();
    if (ignoreCase) cmd = cmd.toLowerCase();
    const filter = e => e.key === cmd || e.aliases.includes(cmd);
    const command = this.client.commands.find(filter);
    if (!command) return;
    const permTest = await this.client.permLevels.test(
      command.permLevel,
      message
    );
    if (!permTest) return command.noPermsRun(message, args);
    if (command.cooldowns.get(message.author.id) > Date.now()) return;
    command.cooldowns.set(message.author.id, Date.now() + command.cooldown);
    command._run(message, args);
  }
};
