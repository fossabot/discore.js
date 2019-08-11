module.exports = class Attachment {
  constructor(file, name) {
    this.file = null;
    if (name) this.setAttachment(file, name);
    else this._attach(file);
  }

  get name() {
    return this.file.name;
  }

  get attachment() {
    return this.file.attachment;
  }

  setAttachment(file, name) {
    this.file = { attachment: file, name };
    return this;
  }

  setFile(attachment) {
    this.file = { attachment };
    return this;
  }

  setName(name) {
    this.file.name = name;
    return this;
  }
};
