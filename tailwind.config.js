/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        // Warm dark theme — matching Dutchie Connect 2.0
        surface: {
          bg: '#141210',
          card: '#1C1B1A',
          border: '#38332B',
          hover: '#282724',
          muted: '#1E1D1B',
        },
        sidebar: {
          bg: '#042017',
          hover: '#0A3021',
          border: 'rgba(255,255,255,0.08)',
        },
        accent: {
          green: '#00C27C',
          'green-light': '#00E08E',
          'green-bg': 'rgba(0,194,124,0.08)',
          gold: '#D4A03A',
          blue: '#64A8E0',
          purple: '#B598E8',
          red: '#E87068',
          amber: '#D4A03A',
        },
        text: {
          primary: '#F0EDE8',
          secondary: '#ADA599',
          muted: '#6B6359',
          inverse: '#141210',
        },
        dutchie: {
          50: 'rgba(0,194,124,0.06)',
          100: 'rgba(0,194,124,0.10)',
          500: '#00C27C',
          600: '#00B07A',
          700: '#00996B',
        },
      },
      boxShadow: {
        'sm': '0 1px 3px rgba(0,0,0,0.3)',
        'card': '0 1px 3px rgba(0,0,0,0.2), 0 1px 2px rgba(0,0,0,0.15)',
        'card-hover': '0 4px 12px rgba(0,0,0,0.3), 0 2px 4px rgba(0,0,0,0.2)',
        'sidebar': '2px 0 12px rgba(0,0,0,0.3)',
        'elevated': '0 8px 24px rgba(0,0,0,0.4)',
        'lg': '0 4px 16px rgba(0,0,0,0.4)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out forwards',
        'slide-up': 'slideUp 0.35s ease-out forwards',
        'slide-in-left': 'slideInLeft 0.3s ease-out forwards',
        'pulse-subtle': 'pulseSubtle 2s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: 0, transform: 'translateY(8px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        slideUp: {
          from: { opacity: 0, transform: 'translateY(12px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        slideInLeft: {
          from: { opacity: 0, transform: 'translateX(-16px)' },
          to: { opacity: 1, transform: 'translateX(0)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.7 },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(0,194,124,0.4)' },
          '50%': { boxShadow: '0 0 0 8px rgba(0,194,124,0)' },
        },
      },
    },
  },
  plugins: [],
};
