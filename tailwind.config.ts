import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        cinzel: ['var(--font-cinzel)', 'serif'],
        josefin: ['var(--font-josefin)', 'sans-serif'],
      },
      colors: {
        primary: '#1D4ED8',
        'primary-dark': '#1E40AF',
        'primary-light': '#3B82F6',
        secondary: '#0369A1',
        'secondary-light': '#0EA5E9',
        brand: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#1E3A5F',
        },
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        'fade-in': 'fadeIn 0.4s ease-out forwards',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
export default config
