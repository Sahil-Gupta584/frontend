import { heroui } from "@heroui/theme";

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
    },
  },
  darkMode: "class",
  plugins: [heroui({
    themes: {
      light: {
        colors: {
          primary: {
            DEFAULT: "#fd366e",
            foreground: "#ffffff"
          }, content1: "#1d1d21"
        },
      },
      dark: {
        colors: {
          background: '#131315', primary: {
            DEFAULT: "#fd366e",
            foreground: "#ffffff"
          }, content1: "#1d1d21"
        }
      }
    }
  })],
}

module.exports = config;