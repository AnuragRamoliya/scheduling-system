import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#1b2430",
        moss: "#2f6f5e",
        coral: "#d8644a",
        skyglass: "#e8f5f7"
      }
    }
  },
  plugins: []
} satisfies Config;
