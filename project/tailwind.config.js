/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#E9EAFB',
          100: '#D4D6F3',
          200: '#A9ADE7',
          300: '#7E84DB',
          400: '#535BCF',
          500: '#3640A5',
          600: '#28307C',
          700: '#1B2052',
          800: '#131739',
          900: '#0D1029',
          950: '#080A1A',
        },
        primary: {
          50: '#F4E6FF',
          100: '#E9CCFF',
          200: '#D399FF',
          300: '#BD66FF',
          400: '#A733FF',
          500: '#9100FF',
          600: '#7400CC',
          700: '#570099',
          800: '#3A0066',
          900: '#1D0033',
        },
        accent: {
          50: '#E6FFF9',
          100: '#CCFFF4',
          200: '#99FFE9',
          300: '#66FFDE',
          400: '#33FFD3',
          500: '#00FFC8',
          600: '#00CCA0',
          700: '#009978',
          800: '#006650',
          900: '#003328',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      animation: {
        'bounce-subtle': 'bounce-subtle 2s infinite',
        'fade-in': 'fade-in 0.3s ease-in-out',
        'slide-up': 'slide-up 0.2s ease-out',
      },
      keyframes: {
        'bounce-subtle': {
          '0%, 100%': { transform: 'translateY(-5%)' },
          '50%': { transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}