const http = require('http');

const tests = [
  '/category/invalid-nonexistent',
  '/',
  '/categories',
  '/category/fresh-fruits',
  '/product/999999999',
];

async function test() {
  for (const url of tests) {
    const res = await new Promise((resolve, reject) => {
      const req = http.request({ hostname: '127.0.0.1', port: 3000, path: url, method: 'GET' }, (res) => {
        const chunks = [];
        res.on('data', (c) => chunks.push(c));
        res.on('end', () => {
          resolve({ status: res.statusCode, length: Buffer.concat(chunks).length });
        });
      });
      req.on('error', reject);
      req.end();
    });
    console.log(`${url}: ${res.status} (${res.length} bytes)`);
  }
}

test().catch(console.error);
