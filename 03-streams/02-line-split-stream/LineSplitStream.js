const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super({ ...options, decodeStrings: false });
    this._rest = '';
  }

  _transform(chunk, encoding, callback) {
    if (chunk.includes(os.EOL)) {
      const splitString = `${this._rest}${chunk}`.split(os.EOL);
      this._rest = splitString.splice(-1)[0];

      splitString.forEach((item) => this.push(item));
      callback();
    } else {
      this._rest += chunk;
      callback();
    }
  }

  _flush(callback) {
    this.push(this._rest);
    callback();
  }
}

module.exports = LineSplitStream;
