const fs = require('fs');
const path = require('path');

function find(d, p) {
  const r = [];
  const files = fs.readdirSync(d);
  files.forEach(f => {
    const full = path.join(d, f);
    const stat = fs.statSync(full);
    if (stat.isDirectory() && f !== 'node_modules' && f !== '.next') {
      r.push(...find(full, p));
    } else {
      if (d.endsWith('app-render') && full.endsWith('.js')) {
        const c = fs.readFileSync(full, 'utf8');
        if (c.includes(p)) {
          r.push(full);
        }
      }
    }
  });
  return r;
}

find('node_modules/next/dist/server/app-render', 'isHTTPAccessFallbackError').forEach(x => console.log(x));
