/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      screens: {
        sm: '576px',
        md: '768px',
        lg: '1024px',
        desktop: '1400px',
      },
      fontFamily: {
        outfit: ['Outfit', 'system-ui', 'sans-serif'],
        urbanist: ['Urbanist', 'system-ui', 'sans-serif'],
      },
      colors: {
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        'surface-2': 'var(--surface-2)',
        line: 'var(--line)',
        'line-2': 'var(--line-2)',
        muted: 'var(--muted)',
        'muted-2': 'var(--muted-2)',
        soft: 'var(--soft)',
        gold: 'var(--gold)',
        'gold-soft': 'var(--gold-soft)',
        'gold-deep': 'var(--gold-deep)',
        'gold-hover': 'var(--gold-hover)',
      },
      lineHeight: {
        100: '1',
        120: '1.2',
        130: '1.3',
        140: '1.4',
        150: '1.5',
      },
    },
  },
  plugins: [],
};
