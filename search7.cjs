const fs = require('fs');
const c = fs.readFileSync('node_modules/next/dist/server/render-result.js', 'utf8');
const lines = c.split('\n');
lines.forEach((l, i) => {
  if (l.includes('pipeToNodeResponse')) {
    console.log((i+1) + ': ' + l.trim());
  }
});
