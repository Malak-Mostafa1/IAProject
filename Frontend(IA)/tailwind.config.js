/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fdfbf7',
          100: '#fbf7ef',
          200: '#f5ebd7',
          300: '#ecdcb3',
          400: '#e0c889',
          500: '#C9A84C', // base gold
          600: '#b8943c',
          700: '#9a7a2e',
          800: '#7c6124',
          900: '#5f4a1c',
        },
      },
      fontFamily: {
        serif: ['Georgia', 'Times New Roman', 'serif'],
        sans: ['Inter', 'Arial', 'Helvetica', 'sans-serif'],
      },
    },
  },
  plugins: [],
}