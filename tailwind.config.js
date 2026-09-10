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
        mc: ["Monocraft", "var(--font-jetbrainsMono)", "monospace"],
      },
    extend: {
      colors: {
        primary: '#1c1c22',
        accent: {
          DEFAULT: '#00ff99',
          hover: '#00e187',
        },
        grass: { DEFAULT: "#7cb342", dark: "#5b8a3c" },
        dirt: { DEFAULT: "#866043", dark: "#6b4a32" },
        stone: { DEFAULT: "#7f7f7f", dark: "#565656" },
        wood: "#9c6b3f",
        redstone: "#d13a2b",
        emerald: "#2ecc71",
        obsidian: "#14121c",
        xp: "#7cff2f",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}