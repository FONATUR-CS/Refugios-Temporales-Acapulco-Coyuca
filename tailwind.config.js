/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        institutional: {
          50: '#eef8f6',
          100: '#d8eee8',
          600: '#275e4e',
          700: '#103f34',
          900: '#082b24',
        },
        gold: {
          50: '#fbf6ed',
          100: '#f1e4cc',
          500: '#c49953',
          600: '#a87e3d',
          700: '#7b5a2b',
        },
        sand: {
          100: '#ddc9a3',
          200: '#d0b888',
        },
        emergency: {
          50: '#eff6ff',
          600: '#2563eb',
          700: '#1d4ed8',
        },
      },
      fontFamily: {
        sans: ['Lato', 'Geomanist', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Inter', 'Geomanist', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        panel: '0 18px 50px rgba(15, 23, 42, 0.14)',
      },
    },
  },
  plugins: [],
}
