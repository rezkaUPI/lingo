/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false,
  theme: {
    extend: {
      // add gradients
      backgroundImage: theme => ({
         'gradient-radial': 'radial-gradient(ellipse at center, #5FDBFD 0%, #5FDBFD 25%, #80EED3 50%, #F4EBA7 75%, #F4EBA7 100%)',
         'gradient-linear': 'linear-gradient(0deg, #5FDBFD 0%, #5FDBFD 25%, #80EED3 50%, #F4EBA7 75%, #F4EBA7 100%)'
      }),
      fontSize: {
        'xxs': '.65rem', // Or any size smaller than text-xs (0.75rem)
      }

    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}

