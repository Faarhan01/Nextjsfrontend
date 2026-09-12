/** @type {import('tailwindcss').Config} */
const config = {
  darkMode: 'class',
  content: [
    './frontend/src/**/*.{js,ts,jsx,tsx,mdx}',
    './frontend/src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './frontend/src/@modules/**/*.{js,ts,jsx,tsx,mdx}',
    './frontend/src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;