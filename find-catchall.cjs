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
          lines.forEach((l, i) => {
            if (l.includes(p) && l.includes('=')) {
              const startLine = Math.max(0, i - 2);
              const endLine = Math.min(lines.length, i + 30);
              for (let j = startLine; j < endLine; j++) {
                console.log((j+1) + ': ' + lines[j].trim());
              }
              console.log('---');
            }
          });
        }
      }
    }
  });
}

searchDir('node_modules/next/dist/server', 'handleCatchallRenderRequest');
