/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        christmas: {
          red: '#8B0000',
          gold: '#FFD700',
          green: '#228B22',
          cream: '#FFF8DC',
        }
      },
      animation: {
        glow: 'glow 2s ease-in-out infinite alternate',
        flip: 'flip 0.8s ease-in-out',
      },
      keyframes: {
        glow: {
          '0%': { textShadow: '0 0 10px #FFD700, 0 0 20px #FFD700, 0 0 30px #FFD700' },
          '100%': { textShadow: '0 0 20px #FFD700, 0 0 30px #FFD700, 0 0 40px #FFD700' },
        },
        flip: {
          '0%': { transform: 'rotateY(0deg)' },
          '100%': { transform: 'rotateY(180deg)' },
        },
      },
    },
  },
  plugins: [],
}
