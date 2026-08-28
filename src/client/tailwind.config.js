/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ufpr: {
          blue: '#002B49',
          gold: '#FFC72C',
          light: '#F4F7F6'
        }
      }
    },
  },
  plugins: [],
}
