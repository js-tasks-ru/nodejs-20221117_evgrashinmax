const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

const handlingGet = (pathname, res) => {
  if (pathname.split('/').length > 1) {
    res.statusCode = 400;
    res.end('Not support nested path');
    return;
  }

  const stream = fs.createReadStream(pathname);
  stream.pipe(res);

  stream.on('error', (err) => {
    if (err.code === 'ENOENT') {
      res.statusCode = 404;
      res.end('Not found file');
    } else {
      res.statusCode = 500;
      res.end('unknow error');
    }
  });

  stream.on('open', () => {});
  stream.on('close', () => {});
}

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
    case 'GET':
      handlingGet(filepath, res);
      break;
    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
