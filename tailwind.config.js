/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        institutional: {
          50: '#eef8f6',
          100: '#d5eee9',
          600: '#137569',
          700: '#0f5e55',
          900: '#002f2a',
        },
        emergency: {
          50: '#eff6ff',
          600: '#2563eb',
          700: '#1d4ed8',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        panel: '0 18px 50px rgba(15, 23, 42, 0.14)',
      },
    },
  },
  plugins: [],
}
