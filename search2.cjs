const fs = require('fs');
const path = require('path');

const pattern = 'NEXT_HTTP_ERROR_FALLBACK';
const searchPaths = ['not-found'];

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

// Search in both server and client dirs
searchDir('node_modules/next/dist/server', pattern);
searchDir('node_modules/next/dist/client', pattern);
