/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
    "!./node_modules/**/*",
    "!./dist/**/*",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'sans-serif'],
      },
      colors: {
        conime: {
          50: '#ffe5ec',
          100: '#fbb8c5',
          200: '#f58da1',
          300: '#ef607b',
          400: '#e9335a',
          500: '#ff1545',
          600: '#cf012b',
          700: '#a00123',
          800: '#75011b',
          900: '#630318',
          950: '#5c0317',
        },
        cogray: {
          50: '#f0f0f3',
          100: '#d1d1d7',
          200: '#bebec2',
          300: '#929294',
          400: '#67676b',
          500: '#42424a',
          600: '#252532',
          700: '#1c1c28',
          800: '#141420',
          900: '#10101d',
          950: '#0b0b16',
        },
      },
    },
  },
  plugins: [],
}
