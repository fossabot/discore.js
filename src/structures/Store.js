const path = require('path');
const fs = require('fs');
const Collection = require('../util/Collection');

function getFiles(filename, maindir, thisdir) {
  const files = [];
  const dir = path.dirname(filename);
  const base = path.basename(filename);
  if (!maindir) maindir = filename;
  let file = {
    path: filename,
    name: base,
    folder: path.basename(dir),
    dir,
  };
  if (thisdir && dir !== maindir) {
    file = {
      path: filename,
      name: base,
      folder: thisdir,
      dir,
    };
  }
  if (file.folder === path.basename(maindir)) file.folder = null;
  if (fs.statSync(filename).isDirectory()) {
    const data = fs.readdirSync(filename);
    data.forEach(e =>
      files.push(...getFiles(path.join(filename, e), maindir, file))
    );
  } else {
    files.push(file);
  }
  return files;
}

/**
 * @extends {Collection}
 */
module.exports = class Store extends Collection {
  constructor(client, type, defaults = null) {
    super();

    this.client = client;
    this.type = type;
    this.folderName = this.client._private[`${this.type}sFolder`];
    this.filePath = this.client._private.fullpath;

    if (defaults) {
      this.init(defaults, path.basename(defaults));
    }
    this.init(this.filePath, this.folderName);
  }

  /**
   * @param {String} filepath
   * @param {String} foldername
   * @returns {Store}
   */
  init(filepath, foldername) {
    try {
      const dirPath = path.dirname(filepath);
      let files = fs.readdirSync(dirPath);
      let dir = files.find(e => e === foldername);
      if (!dir) return;
      dir = path.join(dirPath, dir);
      const stat = fs.statSync(dir);
      if (!stat.isDirectory()) return;
      files = getFiles(dir);
      files.forEach(file => {
        const parents = [];
        let temp = file;
        while (temp.folder) {
          parents.push(temp.folder.name);
          temp = temp.folder;
        }
        const Prop = require(file.path);
        if (typeof Prop !== 'function') {
          if (!{}.hasOwnProperty.call(Prop, 'filenameParent')) {
            const parentName = path
              .basename(file.path)
              .split('.')
              .slice(0, -1)
              .join('.');
            parents.unshift(parentName);
          }

          for (const key in Prop) {
            if ({}.hasOwnProperty.call(Prop, key)) {
              if (
                key === 'filenameParent' &&
                typeof Prop[key] === 'boolean' &&
                Prop[key] === true
              ) {
                const parentName = path
                  .basename(file.path)
                  .split('.')
                  .slice(0, -1)
                  .join('.');
                parents.unshift(parentName);
                delete Prop[key];
              } else {
                const prop = new Prop[key](this.client, file.path);
                prop._private = { parents };
                this.set(prop.id, prop);
              }
            }
          }
        } else {
          const prop = new Prop(this.client, file.path);
          prop._private = { parents };
          this.set(prop.id, prop);
        }
      });
      this.client[`${this.type}s`] = this;
      return this;
    } catch (err) {
      this.client.emit('error', err);
    }
  }
};
