const fs = require('fs');
const c = fs.readFileSync('node_modules/express/lib/response.js', 'utf8');
const lines = c.split('\n');
lines.forEach((l, i) => {
  if (l.includes('writeHead') || l.includes('flushHeaders')) {
    console.log((i+1) + ': ' + l);
  }
});
