const fs = require('fs');
const path = require('path');

function searchDir(d, patterns) {
  const files = fs.readdirSync(d);
  files.forEach(f => {
    const full = path.join(d, f);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      if (f !== 'node_modules' && f !== '.next') {
        searchDir(full, patterns);
      }
    } else {
      if (full.endsWith('.js')) {
        const c = fs.readFileSync(full, 'utf8');
        patterns.forEach(p => {
          const lines = c.split('\n');
          lines.forEach((l, i) => {
            if (l.includes(p)) {
              console.log(full + ':' + (i+1) + ': ' + l.trim().substring(0, 200));
            }
          });
        });
      }
    }
  });
}

searchDir('node_modules/next/dist/server', ['.writeHead(', '.flushHeaders(', 'res.writeHead', 'originalResponse.end']);
