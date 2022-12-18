const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.limit = options.limit;
    this._volumeCounter = 0;
  }

  _transform(chunk, encoding, callback) {
    this._volumeCounter += chunk.length;

    if (this._volumeCounter > this.limit) {
      callback(new LimitExceededError());
      return;
    }


    callback(null, chunk);
  }
}

module.exports = LimitSizeStream;
