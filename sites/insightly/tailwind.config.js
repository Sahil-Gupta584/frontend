import { heroui } from "@heroui/theme";

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sen: ["var(--font-sen)"],
      },
    },
  },
  darkMode: "class",
  plugins: [
    heroui({
      themes: {
        light: {
          colors: {
            primary: {
              50: "#ffe4ec",
              100: "#ffb3c7",
              200: "#ff80a1",
              300: "#ff4d7b",
              400: "#fd366e",
              500: "#e62e63",
              600: "#cc2757",
              700: "#b3204b",
              800: "#991a40",
              900: "#801435",
              DEFAULT: "#fd366e",
              foreground: "#ffffff",
            },
            secondary: {
              50: "#ffe9e1",
              100: "#ffc4b3",
              200: "#ff9e85",
              300: "#ff7957",
              400: "#e78468",
              500: "#cc6f56",
              600: "#b35f49",
              700: "#994f3d",
              800: "#803f31",
              900: "#663024",
              DEFAULT: "#e78468",
              foreground: "#ffffff",
            },
            content1: "#1d1d21",
          },
        },
        dark: {
          colors: {
            background: "#131315",
            primary: {
              50: "#ffe4ec",
              100: "#ffb3c7",
              200: "#ff80a1",
              300: "#ff4d7b",
              400: "#fd366e",
              500: "#e62e63",
              600: "#cc2757",
              700: "#b3204b",
              800: "#991a40",
              900: "#801435",
              DEFAULT: "#fd366e",
              foreground: "#ffffff",
            },
            secondary: {
              50: "#ffe9e1",
              100: "#ffc4b3",
              200: "#ff9e85",
              300: "#ff7957",
              400: "#e78468",
              500: "#cc6f56",
              600: "#b35f49",
              700: "#994f3d",
              800: "#803f31",
              900: "#663024",
              DEFAULT: "#e78468",
              foreground: "#ffffff",
            },
            content1: "#1d1d21",
          },
        },
      },
    }),
  ],
};

module.exports = config;
