import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        physio: {
          950: "#031716",
          900: "#082f2c",
          850: "#0c3b38",
          800: "#115e59",
          700: "#0f766e",
          600: "#0d9488",
          500: "#14b8a6",
          400: "#2dd4bf",
          300: "#5eead4",
          200: "#99f6e4",
          100: "#ccfbf1",
          50: "#f0fdfa",
        },
      },
    },
  },
  plugins: [],
};

export default config;
