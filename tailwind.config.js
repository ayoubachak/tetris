/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    // Ensure tetris piece classes are never purged
    'tetris-i', 'tetris-o', 'tetris-t', 'tetris-s', 'tetris-z', 'tetris-j', 'tetris-l',
    'ghost-i', 'ghost-o', 'ghost-t', 'ghost-s', 'ghost-z', 'ghost-j', 'ghost-l',
    'text-tetris-i', 'text-tetris-o', 'text-tetris-t', 'text-tetris-s', 'text-tetris-z', 'text-tetris-j', 'text-tetris-l',
    'animate-glow', 'animate-fade-in', 'animate-fall', 'animate-line-clear', 'animate-rotate',
    'tetris-ghost'
  ],
  theme: {
    extend: {
      colors: {
        tetris: {
          'i': '#31C7EF', // Cyan for I piece
          'o': '#F7D308', // Yellow for O piece
          't': '#AD4D9C', // Purple for T piece
          's': '#42B642', // Green for S piece
          'z': '#EF2029', // Red for Z piece
          'j': '#5A65AD', // Blue for J piece
          'l': '#EF7921', // Orange for L piece
        },
        slate: {
          900: 'rgb(15 23 42)',
        },
        gray: {
          700: 'rgb(55 65 81)',
          800: 'rgb(31 41 55)',
          900: 'rgb(17 24 39)',
        },
      },
      animation: {
        'line-clear': 'flash 0.5s',
        'fall': 'fall 0.3s ease-in-out',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce': 'bounce 1s infinite',
        'spin': 'spin 1s linear infinite',
      },
      keyframes: {
        flash: {
          '0%, 50%, 100%': { opacity: 1 },
          '25%, 75%': { opacity: 0.5 },
        },
        fall: {
          '0%': { transform: 'translateY(-20px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        pulse: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 },
        },
        bounce: {
          '0%, 100%': {
            transform: 'translateY(-4px)',
            animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)',
          },
          '50%': {
            transform: 'translateY(0)',
            animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)',
          },
        },
        spin: {
          'from': { transform: 'rotate(0deg)' },
          'to': { transform: 'rotate(360deg)' },
        },
      }
    },
  },
  plugins: [],
  darkMode: 'class',
} 