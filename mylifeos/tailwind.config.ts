import type { Config } from "tailwindcss";

// Warna tidak ditulis langsung di sini, tapi dibaca dari variabel CSS (lihat app/globals.css).
// Jadi satu komponen otomatis berganti warna ketika tema berganti, dan modifier
// seperti bg-accent/50 tetap berfungsi berkat <alpha-value>.
const rgb = (name: string) => `rgb(var(--${name}) / <alpha-value>)`;

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: rgb("ink"), // teks utama
        "on-ink": rgb("on-ink"), // teks di atas latar "ink"
        muted: rgb("muted"), // teks sekunder
        surface: rgb("surface"), // warna dasar kartu kaca
        edge: rgb("edge"), // tepi kartu kaca
        danger: rgb("danger"), // aksi berbahaya / pesan error
        canvas: "var(--canvas)", // isi halus (input, chip netral)
        line: "var(--line)", // garis pemisah
        accent: {
          DEFAULT: rgb("accent"), // tombol utama
          soft: rgb("accent-soft"),
          dark: rgb("accent-dark"), // saat di-hover
        },
        brand: {
          DEFAULT: rgb("brand"), // hijau: progres & selesai
          dark: rgb("brand-dark"),
          soft: rgb("brand-soft"),
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
      },
      boxShadow: {
        glass: "var(--glass-shadow)",
      },
    },
  },
  plugins: [],
};
export default config;
