
const colors = require('tailwindcss/colors');

module.exports = {
  mode: 'jit',
  content: [
    './pages/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    colors: {
      primary: '#769756',
      secondary: '#eeeed2',
      background: '#baca44',
      rose: colors.rose
    },
    extend: {},
  },
  plugins: [],
}
