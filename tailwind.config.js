/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#0D4FB5', soft: '#E7EFFB' },
        secondary: { DEFAULT: '#37E0C8', soft: '#E3FAF6' },
        accent: { DEFAULT: '#9E69FF', soft: '#F1EAFF' },
        ink: '#14213D',
        surface: '#F7F9FC',
      },
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
    },
  },
  plugins: [],
};
