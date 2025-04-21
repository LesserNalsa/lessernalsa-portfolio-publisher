import { type Config } from "tailwindcss";

export default {
  content: [
    "./routes/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        lessernavy: "#2c3e50",
        mint: "#98f5e1",
        champagne: "#f7e8b6",
        lightgold: "#f5deb3",
        burgundy: "#7f1d1d",
        sky: "#cfe8fc"
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"]
      }
    }
  }
} satisfies Config;