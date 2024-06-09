/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'main': "url('/bg-main.webp')",
      },
    },
  },
  plugins: [require('tailwindcss-safe-area')],
}