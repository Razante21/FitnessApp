/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#7ab82e',
          dark: '#3b6d11',
          light: '#c0dd97',
          bg: '#1a3a0a',
          bglight: '#0f1a08',
        },
        dark: {
          900: '#0f0f0f',
          800: '#151515',
          700: '#1e1e1e',
          600: '#2a2a2a',
          500: '#333333',
          400: '#444444',
        }
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      }
    },
  },
  plugins: [],
}
