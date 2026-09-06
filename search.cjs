const fs = require('fs');
const c = fs.readFileSync('node_modules/next/dist/server/base-server.js', 'utf8');
const lines = c.split('\n');
lines.forEach((l,i) => {
  if (l.includes('sendRenderResult') && l.includes('{')) {
    console.log((i+1) + ': ' + l.trim());
  }
});
