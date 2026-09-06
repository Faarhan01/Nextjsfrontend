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
          console.log(full);
        }
      }
    }
  });
}

// Search for writeHead across all Next.js dist
searchDir('node_modules/next/dist', 'writeHead');
