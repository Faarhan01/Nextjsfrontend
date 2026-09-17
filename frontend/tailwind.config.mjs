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
    extend: {
      maxWidth: {
        '7xl': '80rem',
        '8xl': '100rem',
      },
      screens: {
        '2xsmall': '320px',
        'xsmall': '512px',
        'small': '1024px',
        'medium': '1280px',
        'large': '1440px',
        'xlarge': '1680px',
        '2xlarge': '1920px',
      },
      fontFamily: {
        sans: [
          'var(--font-sans)',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'sans-serif',
        ],
        mono: [
          'var(--font-mono)',
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'monospace',
        ],
      },
      borderRadius: {
        none: '0px',
        xs: 'var(--radius-xs)',
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        '2xl': 'var(--radius-2xl)',
        // Medusa UI Named Radii
        soft: 'var(--radius-md)',
        base: 'var(--radius-lg)',
        rounded: 'var(--radius-xl)',
        large: 'var(--radius-2xl)',
        circle: '9999px',
      },
      colors: {
        // Medusa UI Design System Tokens
        ui: {
          bg: {
            base: 'var(--ui-bg-base)',
            subtle: 'var(--ui-bg-subtle)',
            component: 'var(--ui-bg-component)',
            field: 'var(--ui-bg-field)',
            elevated: 'var(--ui-bg-elevated)',
          },
          fg: {
            base: 'var(--ui-fg-base)',
            subtle: 'var(--ui-fg-subtle)',
            muted: 'var(--ui-fg-muted)',
            onColor: 'var(--ui-fg-on-color)',
          },
          border: {
            base: 'var(--ui-border-base)',
            strong: 'var(--ui-border-strong)',
            subtle: 'var(--ui-border-subtle)',
          },
          button: {
            primary: {
              DEFAULT: 'var(--btn-primary-bg)',
              hover: 'var(--btn-primary-hover)',
              text: 'var(--btn-primary-text)',
            },
            secondary: {
              DEFAULT: 'var(--btn-secondary-bg)',
              hover: 'var(--btn-secondary-hover)',
              text: 'var(--btn-secondary-text)',
              border: 'var(--btn-secondary-border)',
            },
          },
        },
        // Direct Semantic Palette Bindings
        canvas: 'var(--bg-canvas)',
        surface: {
          DEFAULT: 'var(--bg-surface)',
          subtle: 'var(--bg-surface-subtle)',
          elevated: 'var(--bg-surface-elevated)',
          hover: 'var(--bg-surface-hover)',
          active: 'var(--bg-surface-active)',
        },
        primary: {
          DEFAULT: 'var(--btn-primary-bg)',
          hover: 'var(--btn-primary-hover)',
          active: 'var(--btn-primary-active)',
        },
      },
      transitionTimingFunction: {
        medusa: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
};

export default config;
