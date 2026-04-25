/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        syne: ['Syne', 'sans-serif'],
        mono: ['Space Mono', 'monospace'],
        khmer: ['Noto Sans Khmer', 'sans-serif'],
      },
      colors: {
        brand: {
          purple: '#7c3aed',
          'purple-light': '#a855f7',
          'purple-dim': '#4c1d95',
          orange: '#ff6b2b',
          red: '#e8192c',
        }
      },
      backgroundImage: {
        'bg-grad': 'linear-gradient(to bottom right, #000000, #0f172a, #1a0533)',
      },
      animation: {
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'float': 'float 4s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) scale(1)' },
          '50%': { transform: 'translateY(-6px) scale(1.01)' },
        }
      }
    },
  },
  plugins: [],
}
