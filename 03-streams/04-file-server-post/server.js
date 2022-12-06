const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const LimitSizeStream = require('./LimitSizeStream');

const server = new http.Server();


server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  if (pathname.includes('/')) {
    res.statusCode = 400;
    res.end('Not support nested path');
    return;
  }

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'POST':
      try {
        const findFile = fs.statSync(filepath);
        if (findFile.isFile()) {
          res.statusCode = 409;
          res.end('File exists');
          return;
        }
      } catch (ignore) {
        const streamWrite = fs.createWriteStream(filepath);
        const limitStream = new LimitSizeStream({limit: 1048576});

        req.pipe(limitStream).pipe(streamWrite);

        req.on('aborted', () => {
          streamWrite.destroy();
          fs.rmSync(filepath);
        });


        limitStream.on('error', (err) => {
          fs.rmSync(filepath);
          streamWrite.destroy(err);
        });

        streamWrite.on('error', (err) => {
          if ('LIMIT_EXCEEDED' === err.code) {
            res.statusCode = 413;
            res.end('Too large file');
          } else {
            res.statusCode = 500;
            res.end('Unknown error');
          }
        });

        streamWrite.on('finish', () => {
          res.statusCode = 201;
          res.end('OK');
        });

      }
      break;
    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
