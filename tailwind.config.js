/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      backgroundColor: {
        'navcolor': '#1d4736'
      }
    },
  },
  plugins: [require('tailwindcss-safe-area')],
}