/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./App.{js,ts,tsx}', './src/**/*.{js,ts,tsx}'],

  presets: [require('nativewind/preset')],
  theme: {
    extend: {},
  },
  plugins: [],
};
