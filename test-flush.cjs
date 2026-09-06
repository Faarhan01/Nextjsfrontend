const http = require('http');

const s = http.createServer((req, res) => {
  const origWriteHead = res.writeHead.bind(res);
  res.writeHead = function(code, ...args) {
    console.log('writeHead called with:', code);
    return origWriteHead(code, ...args);
  };
  res.statusCode = 404;
  res.setHeader('x-test', '1');
  res.flushHeaders();
  res.end('test');
});

s.listen(9999, () => {
  const req = http.request({
    hostname: '127.0.0.1',
    port: 9999,
    path: '/',
    method: 'GET'
  }, (res) => {
    console.log('Client received status:', res.statusCode);
    s.close();
  });
  req.end();
});
