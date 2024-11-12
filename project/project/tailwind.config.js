/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'maple-blue': '#1E88E5',
        'maple-blue-dark': '#1976D2',
        'maple-orange': '#FF5722',
        'maple-orange-dark': '#F4511E'
      }
    },
  },
  plugins: [],
};