/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f7ff',
          100: '#b3e7ff',
          200: '#80d7ff',
          300: '#4dc7ff',
          400: '#1ab7ff',
          500: '#00a3ff',
          600: '#0082cc',
          700: '#006199',
          800: '#004066',
          900: '#002033',
        },
        accent: {
          50: '#f0f4ff',
          100: '#d9e5ff',
          200: '#b3cbff',
          300: '#8db1ff',
          400: '#6797ff',
          500: '#417dff',
          600: '#3464cc',
          700: '#274b99',
          800: '#1a3266',
          900: '#0d1933',
        }
      },
      animation: {
        'gradient': 'gradient 3s ease infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(0, 163, 255, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(0, 163, 255, 0.8)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
