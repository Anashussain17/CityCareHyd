// tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // include all React files
  ],
  theme: {
    extend: {fontFamily: {
      poppins: ['Poppins', 'sans-serif'],
    },},
  },
  plugins: [],
}
