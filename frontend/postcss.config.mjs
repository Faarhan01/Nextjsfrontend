import { existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');

const config = {
  plugins: {},
};

// Support both Tailwind CSS v3 and v4
// v4 requires @tailwindcss/postcss as a separate package
// v3 uses tailwindcss directly as a PostCSS plugin
if (existsSync(join(rootDir, 'node_modules/@tailwindcss/postcss'))) {
  config.plugins['@tailwindcss/postcss'] = {};
} else {
  config.plugins['tailwindcss'] = {};
}

config.plugins['autoprefixer'] = {};

export default config;