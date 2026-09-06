const fs = require('fs');
const path = require('path');

function searchDir(d, p) {
  const files = fs.readdirSync(d);
  files.forEach(f => {
    const full = path.join(d, f);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      if (f !== 'node_modules' && f !== '.next') {
        searchDir(full, p);
      }
    } else {
      if (full.endsWith('.js')) {
        const c = fs.readFileSync(full, 'utf8');
        const lines = c.split('\n');
        lines.forEach((l, i) => {
          if (l.includes(p) && (l.includes('res.') || l.includes('response.'))) {
            console.log(full + ':' + (i+1) + ': ' + l.trim().substring(0, 300));
          }
        });
      }
    }
  });
}

searchDir('node_modules/next/dist/server', 'writeHead(');
