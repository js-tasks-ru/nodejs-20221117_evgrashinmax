const url = require('url');
const http = require('http');
const path = require('path');
const fs = require("fs");

const server = new http.Server();

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  if (pathname.includes('/')) {
    res.statusCode = 400;
    res.end('Not support nested path');
    return;
  }

  switch (req.method) {
    case 'DELETE':
      try {
        const findFile = fs.statSync(filepath);
        if (findFile.isFile()) {
          fs.rmSync(filepath);
          res.statusCode = 200;
          res.end('OK');
        }
      } catch (ignore) {
        res.statusCode = 404;
        res.end('Not found file');
        return;
      }
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
