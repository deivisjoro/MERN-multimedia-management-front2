/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'blue-100': '#EBF8FF',
        'blue-500': '#4299E1',
        'blue-700': '#2B6CB0',
        'green-100': '#F0FFF4',
        'green-500': '#48BB78',
        'green-700': '#2F855A',
        'yellow-100': '#FFFFF0',
        'yellow-500': '#ECC94B',
        'yellow-700': '#D69E2E',
      }
    },
  },
  plugins: [],
}
