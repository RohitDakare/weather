/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#ff6b9d',
        secondary: '#a855f7',
        accent: '#06d6a0',
        warm: '#ffeaa7',
        text: '#2d3436',
        'text-light': '#636e72',
        'card-bg': 'rgba(255, 255, 255, 0.95)',
        shadow: 'rgba(255, 107, 157, 0.1)',
      },
    },
  },
  plugins: [],
}
