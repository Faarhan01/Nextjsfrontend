import { existsSync, readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createRequire } from 'module';

const config = {
  plugins: {},
};

// Helper to locate a package or package file across ancestor directories or module resolution
function resolvePackagePath(pkgPath) {
  // 1. Try standard Node resolution using createRequire from process.cwd() and import.meta.url
  const bases = [
    join(process.cwd(), 'index.js'),
  ];
  try {
    if (import.meta && import.meta.url) {
      bases.push(fileURLToPath(import.meta.url));
    }
  } catch {
    // Ignore URL parsing errors in virtual/turbopack environments
  }

  for (const base of bases) {
    try {
      const req = createRequire(base);
      return req.resolve(pkgPath);
    } catch {
      // Continue to next base
    }
  }

  // 2. Search ancestor directories for node_modules/pkgPath
  const searchRoots = [process.cwd()];
  try {
    if (import.meta && import.meta.url) {
      searchRoots.push(dirname(fileURLToPath(import.meta.url)));
    }
  } catch {
    // Ignore
  }

  for (const startDir of searchRoots) {
    let curr = startDir;
    while (curr) {
      const candidate = join(curr, 'node_modules', pkgPath);
      if (existsSync(candidate)) {
        return candidate;
      }
      const parent = dirname(curr);
      if (parent === curr) break;
      curr = parent;
    }
  }

  return null;
}

// 1. Check installed Tailwind CSS version
let tailwindMajorVersion = null;
const tailwindPkgJsonPath = resolvePackagePath('tailwindcss/package.json');
if (tailwindPkgJsonPath) {
  try {
    const pkg = JSON.parse(readFileSync(tailwindPkgJsonPath, 'utf8'));
    if (pkg && typeof pkg.version === 'string') {
      const major = parseInt(pkg.version.split('.')[0], 10);
      if (!isNaN(major)) {
        tailwindMajorVersion = major;
      }
    }
  } catch {
    // Ignore parse errors
  }
}

// 2. Check if @tailwindcss/postcss plugin package is installed
const hasTailwindPostcssPkg = Boolean(resolvePackagePath('@tailwindcss/postcss'));

// 3. Fallback: check closest package.json
if (!tailwindMajorVersion) {
  let curr = process.cwd();
  while (curr) {
    const pkgPath = join(curr, 'package.json');
    if (existsSync(pkgPath)) {
      try {
        const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
        const allDeps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
        const twVer = allDeps['tailwindcss'];
        if (typeof twVer === 'string') {
          const cleaned = twVer.replace(/^[^0-9]*/, '');
          const major = parseInt(cleaned.split('.')[0], 10);
          if (!isNaN(major)) {
            tailwindMajorVersion = major;
            break;
          }
        }
      } catch {
        // Ignore
      }
    }
    const parent = dirname(curr);
    if (parent === curr) break;
    curr = parent;
  }
}

// Auto-detect Tailwind CSS version:
// Version 4+: uses '@tailwindcss/postcss' PostCSS plugin
// Version 3: uses 'tailwindcss' PostCSS plugin
const isTailwindV4 = tailwindMajorVersion === 4 || (tailwindMajorVersion === null && hasTailwindPostcssPkg);

if (isTailwindV4 && hasTailwindPostcssPkg) {
  config.plugins['@tailwindcss/postcss'] = {};
} else {
  config.plugins['tailwindcss'] = {};
}

config.plugins['autoprefixer'] = {};

export default config;


