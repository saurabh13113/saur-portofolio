/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
    './src/**/*.{js,jsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "15px",
    },
      screens: {
        sm: '640px',
        md: '768px',
        lg: '960px',
        xl: '1200px',
      },
      fontFamily: {
        primary: "var(--font-jetbrainsMono)",
        mc: ["var(--font-jetbrainsMono)", "monospace"],
      },
    extend: {
      colors: {
        primary: '#1c1c22',
        accent: {
          DEFAULT: '#f4d27a',
          hover: '#e0b25a',
        },
        redstone: "#d13a2b",
        emerald: "#2ecc71",
        obsidian: "#14121c",
        xp: "#f4d27a",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}