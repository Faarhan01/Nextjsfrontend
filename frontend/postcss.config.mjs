import { existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const config = {
  plugins: {},
};

// Support both Tailwind CSS v3 and v4
// v4 requires @tailwindcss/postcss as a separate package
// v3 uses tailwindcss directly as a PostCSS plugin
const possibleRoots = [
  join(__dirname, '..'),
  process.cwd(),
  resolve(__dirname, '..', 'frontend'),
  resolve(__dirname, '..', '..', 'frontend'),
];

let tailwindcssPostcss: string | null = null;
let tailwindcss: string | null = null;

for (const root of possibleRoots) {
  const postcssPath = join(root, 'node_modules/@tailwindcss/postcss');
  const tailwindcssPath = join(root, 'node_modules/tailwindcss');
  
  if (!tailwindcssPostcss && existsSync(postcssPath)) {
    tailwindcssPostcss = postcssPath;
  }
  if (!tailwindcss && existsSync(tailwindcssPath)) {
    tailwindcss = tailwindcssPath;
  }
}

if (tailwindcssPostcss) {
  config.plugins['@tailwindcss/postcss'] = {};
} else if (tailwindcss) {
  config.plugins['tailwindcss'] = {};
} else {
  config.plugins['tailwindcss'] = {};
}

config.plugins['autoprefixer'] = {};

export default config;
