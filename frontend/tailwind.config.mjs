/** @type {import('tailwindcss').Config} */
const config = {
  darkMode: 'class',
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/@modules/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        '.bg-card\\/90': {
          'background-color': 'color-mix(in srgb, var(--card-bg) 90%, transparent) !important',
        },
        '.bg-card\\/95': {
          'background-color': 'color-mix(in srgb, var(--card-bg) 95%, transparent) !important',
        },
        '.bg-surface\\/90': {
          'background-color': 'color-mix(in srgb, var(--bg-surface) 90%, transparent) !important',
        },
        '.bg-surface\\/95': {
          'background-color': 'color-mix(in srgb, var(--bg-surface) 95%, transparent) !important',
        },
      };
      addUtilities(newUtilities);
    },
  ],
};

export default config;
