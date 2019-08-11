const Attachment = require('../util/Attachment');

function resolveColor(color) {
  if (typeof color === 'string') {
    if (color === 'RANDOM') return Math.floor(Math.random() * (0xffffff + 1));
    if (color === 'DEFAULT') return 0;
    color = /* Constants.Colors[color] || */ parseInt(
      color.replace('#', ''),
      16
    );
  } else if (color instanceof Array) {
    color = (color[0] << 16) + (color[1] << 8) + color[2];
  }

  if (color < 0 || color > 0xffffff) {
    throw new RangeError(
      'Color must be within the range 0 - 16777215 (0xFFFFFF).'
    );
  } else if (color && Number.isNaN(color)) {
    throw new TypeError('Unable to convert color to a number.');
  }

  return color;
}

function resolveString(data) {
  if (typeof data === 'string') return data;
  if (data instanceof Array) return data.join('\n');
  return String(data);
}

module.exports = class Embed {
  constructor(data = {}) {
    this.title = data.title;
    this.description = data.description;
    this.url = data.url;
    this.color = data.colo;
    this.author = data.author;
    this.timestamp = data.timestamp;
    this.fields = data.fields || [];
    this.thumbnail = data.thumbnai;
    this.image = data.image;
    this.footer = data.footer;
    this.file = data.file;
    this.files = [];
  }

  setTitle(title) {
    title = resolveString(title);
    if (title.length > 256) {
      throw new RangeError('RichEmbed titles may not exceed 256 characters.');
    }
    this.title = title;
    return this;
  }

  setDescription(description) {
    description = resolveString(description);
    if (description.length > 2048) {
      throw new RangeError(
        'RichEmbed descriptions may not exceed 2048 characters.'
      );
    }
    this.description = description;
    return this;
  }

  setURL(url) {
    this.url = url;
    return this;
  }

  setColor(color) {
    this.color = resolveColor(color);
    return this;
  }

  setAuthor(name, icon, url) {
    this.author = { name: resolveString(name), icon_url: icon, url };
    return this;
  }

  setTimestamp(timestamp = Date.now()) {
    if (timestamp instanceof Date) timestamp = timestamp.getTime();
    this.timestamp = timestamp;
    return this;
  }

  addField(name, value, inline = false) {
    if (this.fields.length >= 25) {
      throw new RangeError('RichEmbeds may not exceed 25 fields.');
    }
    name = resolveString(name);
    if (name.length > 256) {
      throw new RangeError(
        'RichEmbed field names may not exceed 256 characters.'
      );
    }
    if (!/\S/.test(name)) {
      throw new RangeError('RichEmbed field names may not be empty.');
    }
    value = resolveString(value);
    if (value.length > 1024) {
      throw new RangeError(
        'RichEmbed field values may not exceed 1024 characters.'
      );
    }
    if (!/\S/.test(value)) {
      throw new RangeError('RichEmbed field values may not be empty.');
    }
    this.fields.push({ name, value, inline });
    return this;
  }

  addBlankField(inline = false) {
    return this.addField('\u200B', '\u200B', inline);
  }

  setThumbnail(url) {
    this.thumbnail = { url };
    return this;
  }

  setImage(url) {
    this.image = { url };
    return this;
  }

  setFooter(text, icon) {
    text = resolveString(text);
    if (text.length > 2048) {
      throw new RangeError(
        'RichEmbed footer text may not exceed 2048 characters.'
      );
    }
    this.footer = { text, icon_url: icon };
    return this;
  }

  attachFile(file) {
    if (this.file) {
      throw new RangeError('You may not upload more than one file at once.');
    }
    if (file instanceof Attachment) file = file.file;
    this.file = file;
    return this;
  }

  attachFiles(files) {
    files = files.map(file => (file instanceof Attachment ? file.file : file));
    this.files = this.files.concat(files);
    return this;
  }

  get length() {
    return (
      (this.title ? this.title.length : 0) +
      (this.description ? this.description.length : 0) +
      (this.fields.length >= 1
        ? this.fields.reduce(
            (prev, curr) => prev + curr.name.length + curr.value.length,
            0
          )
        : 0) +
      (this.footer ? this.footer.text.length : 0) +
      (this.author ? this.author.name.length : 0)
    );
  }
};
