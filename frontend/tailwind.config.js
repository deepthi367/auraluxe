/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        nude: {
          50: '#FBF7F2',
          100: '#F5EBE0',
          200: '#EDE0D4',
          300: '#E8D5C4',
          400: '#DDB892',
        },
        gold: {
          400: '#E8C39E',
          500: '#D4AF37',
          600: '#C9A227',
        },
        slateink: {
          700: '#44403C',
          800: '#292524',
          900: '#1C1917',
        },
      },
      fontFamily: {
        display: ['Cormorant Garamond', 'serif'],
        sans: ['Outfit', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        luxe: '0 20px 50px -20px rgba(28, 25, 23, 0.25)',
      },
    },
  },
  plugins: [],
};
