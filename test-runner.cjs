const { spawn } = require('child_process');
const http = require('http');
const tests = ['/category/invalid-nonexistent', '/', '/categories', '/category/fresh-fruits', '/product/999999999'];
const server = spawn('C:\\Program Files\\nodejs\\node.exe', ['dist/server.cjs'], { cwd: 'C:\\Users\\faarh\\OneDrive\\Documents\\ref\\modern\\Nextjsfrontend', stdio: ['ignore', 'pipe', 'pipe'] });
let started = false;
function test() {
  Promise.all(tests.map(url => new Promise(resolve => {
    const req = http.request({ hostname: '127.0.0.1', port: 3000, path: url, method: 'GET' }, (res) => {
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => { console.log(url + ': ' + res.statusCode + ' (' + Buffer.concat(chunks).length + ' bytes)'); resolve(); });
    });
    req.on('error', () => resolve());
    req.end();
  }))).then(() => { server.kill(); process.exit(0); });
}
server.stderr.on('data', (data) => {
  const output = data.toString();
  process.stdout.write(output);
  if (output.includes('Server running') && !started) { started = true; setTimeout(test, 1000); }
});
server.stdout.on('data', (data) => {
  const output = data.toString();
  process.stdout.write(output);
  if (output.includes('Server running') && !started) { started = true; setTimeout(test, 1000); }
});
setTimeout(() => { if (!started) { console.log('Server did not start in time, testing...'); test(); } }, 15000);
