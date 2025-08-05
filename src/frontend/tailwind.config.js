/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {

      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        nunito: ['Nunito', 'sans-serif'],
      },
      keyframes: {
        'fade-in-down': {
          '0%': {
            opacity: '0',
            transform: 'translateY(-10px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          },
        }
      },

      animation: {
        'fade-in-down': 'fade-in-down 0.3s ease-out'
      }

    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}