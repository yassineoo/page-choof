module.exports = {
  darkMode: 'class',
  content: [
    './public/**/*.html',
    './public/**/*.js',
    './components/**/*.js',
    './js/**/*.js'
  ],
  theme: {
    extend: {
      colors: {
        'ooredoo-red': '#E31D23',
        'dark-bg': '#141414',
        'light-bg': '#F8F8F8',
        'text-gray': '#7F7F7F'
      },
      fontFamily: {
        rubik: ['Rubik', 'sans-serif']
      },
      boxShadow: {
        'forfait': [
          '-0.93px 7.46px 16.78px rgba(79, 79, 79, 0.1)',
          '-2.8px 29.82px 29.82px rgba(79, 79, 79, 0.09)'
        ]
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography')
  ]
}