/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#010221',
          50: '#f0f0f5',
          100: '#e1e1eb',
          200: '#c3c3d7',
          300: '#a5a5c3',
          400: '#8787af',
          500: '#69699b',
          600: '#4b4b87',
          700: '#2d2d73',
          800: '#0f0f5f',
          900: '#010221',
        },
        teal: {
          DEFAULT: '#0A7373',
          50: '#f0f9f9',
          100: '#e1f3f3',
          200: '#c3e7e7',
          300: '#a5dbdb',
          400: '#87cfcf',
          500: '#69c3c3',
          600: '#0A7373',
          700: '#086767',
          800: '#065b5b',
          900: '#044f4f',
        },
        sage: {
          DEFAULT: '#B7BF99',
          50: '#f7f8f4',
          100: '#eff1e9',
          200: '#dfe3d3',
          300: '#cfd5bd',
          400: '#bfc7a7',
          500: '#B7BF99',
          600: '#a5ac8a',
          700: '#93997b',
          800: '#81866c',
          900: '#6f735d',
        },
        gold: {
          DEFAULT: '#EDAA25',
          50: '#fef9f0',
          100: '#fdf3e1',
          200: '#fbe7c3',
          300: '#f9dba5',
          400: '#f7cf87',
          500: '#EDAA25',
          600: '#d69921',
          700: '#bf881d',
          800: '#a87719',
          900: '#916615',
        },
        rust: {
          DEFAULT: '#C43302',
          50: '#fcf0ed',
          100: '#f9e1db',
          200: '#f3c3b7',
          300: '#eda593',
          400: '#e7876f',
          500: '#e1694b',
          600: '#C43302',
          700: '#ae2d02',
          800: '#982702',
          900: '#822101',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'inner-light': 'inset 0 2px 4px 0 rgba(183, 191, 153, 0.06)',
      },
      borderRadius: {
        'xl': '1rem',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
  extend: {
    keyframes: {
      'fade-in': {
        '0%': { opacity: '0' },
        '100%': { opacity: '1' }
      },
      'slide-in': {
        '0%': { transform: 'translateY(10px)', opacity: '0' },
        '100%': { transform: 'translateY(0)', opacity: '1' }
      },
      'scale-in': {
        '0%': { transform: 'scale(0.95)', opacity: '0' },
        '100%': { transform: 'scale(1)', opacity: '1' }
      },
      'bounce-in': {
        '0%': { transform: 'scale(0.3)', opacity: '0' },
        '50%': { transform: 'scale(1.05)', opacity: '0.8' },
        '70%': { transform: 'scale(0.9)', opacity: '0.9' },
        '100%': { transform: 'scale(1)', opacity: '1' }
      },
      'spin-slow': {
        '0%': { transform: 'rotate(0deg)' },
        '100%': { transform: 'rotate(360deg)' }
      }
    },
    animation: {
      'fade-in': 'fade-in 0.3s ease-out',
      'slide-in': 'slide-in 0.4s ease-out',
      'scale-in': 'scale-in 0.3s ease-out',
      'bounce-in': 'bounce-in 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      'spin-slow': 'spin-slow 3s linear infinite'
    },
  }
}
