const fs = require('fs');
const files = [
  'node_modules/next/dist/compiled/next-server/app-page-experimental.runtime.dev.js',
  'node_modules/next/dist/compiled/next-server/app-page-experimental.runtime.prod.js',
  'node_modules/next/dist/compiled/next-server/app-page-turbo-experimental.runtime.dev.js',
  'node_modules/next/dist/compiled/next-server/app-page-turbo-experimental.runtime.prod.js',
  'node_modules/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js',
  'node_modules/next/dist/compiled/next-server/app-page-turbo.runtime.prod.js',
  'node_modules/next/dist/compiled/next-server/app-page.runtime.dev.js',
  'node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js',
];

files.forEach(f => {
  try {
    const c = fs.readFileSync(f, 'utf8');
    const lines = c.split('\n');
    lines.forEach((l, i) => {
      if (l.includes('writeHead')) {
        console.log(f + ':' + (i+1) + ': ' + l.trim().substring(0, 200));
      }
    });
  } catch(e) {
    console.log(f + ': NOT FOUND');
  }
});
