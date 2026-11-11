/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Bahij TheSansArabic', 'Noto Kufi Arabic', 'Alexandria', 'system-ui', 'sans-serif'],
        brand: ['BigVesta Arabic Beta', 'Bahij TheSansArabic', 'Noto Kufi Arabic', 'Alexandria', 'system-ui', 'sans-serif'],
        latin: ['Trajan Sans Pro', 'Cinzel', 'Palatino Linotype', 'serif'],
      },
      colors: {
        primary: {
          50: '#fff1f2',
          100: '#ffe1e4',
          200: '#ffc8ce',
          300: '#ff9ba5',
          400: '#ff5d6b',
          500: '#da0812',
          600: '#c30710',
          700: '#9c1006',
          800: '#7d070c',
          900: '#4d0306',
          950: '#240002',
        },
        gold: {
          50: '#fff5f5',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#e30513',
          600: '#b80811',
          700: '#9c1006',
          800: '#7f0b10',
          900: '#4c0508',
        },
        dark: {
          50: '#f7f7f7',
          100: '#e6e6e6',
          200: '#d1d1d1',
          300: '#b0b0b0',
          400: '#888888',
          500: '#666666',
          600: '#4d4d4d',
          700: '#333333',
          800: '#1f1f1f',
          900: '#111111',
          950: '#000000',
        },
        cream: '#ffffff',
        warm: '#f7f5f5',
      },
      animation: {
        'marquee': 'marquee 40s linear infinite',
        'marquee-rtl': 'marquee-rtl 40s linear infinite',
        'spin-slow': 'spin 3s linear infinite',
        'fade-in': 'fade-in 0.6s ease-out',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'marquee-rtl': {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
