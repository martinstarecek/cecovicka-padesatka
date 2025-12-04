/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./public/**/*.html"],
  theme: {
    extend: {
      colors: {
        'brand-dark': '#0f172a',
        'brand-gold': '#fbbf24',
        'brand-green': '#15803d',
        'brand-gray': '#1e293b',
      },
      fontFamily: {
        'heading': ['Oswald', 'sans-serif'],
        'body': ['Roboto', 'sans-serif'],
      }
    }
  },
  plugins: [],
}