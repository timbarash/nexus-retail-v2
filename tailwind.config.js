/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        // Nexus v2 — light mode palette inspired by Dutchie Connect
        surface: {
          bg: '#f7f8fa',
          card: '#ffffff',
          border: '#e5e7eb',
          hover: '#f0f1f3',
          muted: '#f3f4f6',
        },
        sidebar: {
          bg: '#0f172a',
          hover: '#1e293b',
          border: '#1e293b',
          muted: '#334155',
        },
        accent: {
          green: '#00a35e',
          'green-light': '#10b981',
          'green-bg': 'rgba(0, 163, 94, 0.08)',
          gold: '#d97706',
          blue: '#3b82f6',
          purple: '#8b5cf6',
          red: '#ef4444',
        },
        text: {
          primary: '#1a1a2e',
          secondary: '#6b7280',
          muted: '#9ca3af',
          inverse: '#f9fafb',
        },
        dutchie: {
          50: 'rgba(0, 163, 94, 0.06)',
          100: 'rgba(0, 163, 94, 0.10)',
          500: '#00a35e',
          600: '#00905a',
          700: '#007d4e',
        },
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        'card-hover': '0 4px 12px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04)',
        'sidebar': '2px 0 8px rgba(0,0,0,0.1)',
        'elevated': '0 8px 24px rgba(0,0,0,0.12)',
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out forwards',
        'slide-up': 'slideUp 0.35s ease-out forwards',
        'slide-in-left': 'slideInLeft 0.3s ease-out forwards',
        'pulse-subtle': 'pulseSubtle 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: 0, transform: 'translateY(8px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        slideUp: {
          from: { opacity: 0, transform: 'translateY(16px)' },
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
      },
    },
  },
  plugins: [],
};
