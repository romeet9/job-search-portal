/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: "#0a0a0a",
        surface2: "#141414",
        surface3: "#1a1a1a",
        accent: "#ffffff",
        border: "rgba(255,255,255,0.1)",
        "text-primary": "#ffffff",
        "text-secondary": "#a0a0a0",
        "text-muted": "#606060",
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
