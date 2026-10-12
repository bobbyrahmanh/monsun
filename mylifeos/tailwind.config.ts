import type { Config } from "tailwindcss";

// Palet warna ada di sini: ubah sekali, seluruh aplikasi ikut berubah.
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        canvas: "#eff0f0",
        ink: "#16181a",
        muted: "#757b80",
        line: "#e4e6e7",
        brand: {
          DEFAULT: "#1fcf8e",
          dark: "#12a371",
          soft: "#e2f8ef",
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(22,24,26,0.04), 0 4px 16px rgba(22,24,26,0.04)",
      },
    },
  },
  plugins: [],
};
export default config;
