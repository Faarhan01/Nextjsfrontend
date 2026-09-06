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
        if (c.includes(p)) {
          const lines = c.split('\n');
          lines.forEach((line, i) => {
            if (line.includes(p)) {
              console.log(full + ':' + (i+1) + ': ' + line.trim());
            }
          });
        }
      }
    }
  });
}

searchDir('node_modules/next/dist/server', '.writeHead(');
