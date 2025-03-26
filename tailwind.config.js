module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'space-black': '#0A0A0A',
        'cosmic-blue': '#0B3D91',
        'stellar-purple': '#6D2E75',
        'neon-green': '#39FF14',
        'alien-orange': '#FF5E0E',
      },
      fontFamily: {
        futuristic: ['Orbitron', 'sans-serif'],
        base: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'space-gradient': 'linear-gradient(to right, #0A0A0A, #0B3D91)',
      },
    },
  },
  plugins: [],
} 