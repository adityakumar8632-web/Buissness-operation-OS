import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#14231F",
        paper: "#F6F5F0",
        pine: "#1F3D34",
        moss: "#3E6B58",
        amber: "#C97A2B",
        line: "#D9D6CB",
      },
      fontFamily: {
        sans: ["'Inter'", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
