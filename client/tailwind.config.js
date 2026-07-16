export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkBg: '#0a0a0f',
        cardBg: '#111118',
        accentViolet: '#7c3aed',
        accentPurple: '#8b5cf6',
        accentCyan: '#06b6d4',
      },
      fontFamily: {
        heading: ['Syne', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        }
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-in-out',
      }
    },
  },
  plugins: [],
}
