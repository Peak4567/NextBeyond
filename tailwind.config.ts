import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#eef6ff",
          100: "#d9ecff",
          200: "#b8dcff",
          300: "#86c5ff",
          400: "#4da4ff",
          500: "#2382ff",
          600: "#0d63f2",
          700: "#0a4fd1",
          800: "#0d43a8",
          900: "#0f3a85",
          950: "#0a2555",
        },
        navy: {
          900: "#0b1b3a",
          950: "#071229",
        },
      },
      fontFamily: {
        sans: ["var(--font-noto)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 10px 30px -10px rgba(13, 99, 242, 0.25)",
        card: "0 8px 24px -8px rgba(15, 23, 42, 0.12)",
        glow: "0 0 40px 0 rgba(77, 164, 255, 0.35)",
      },
      backgroundImage: {
        "grid-glow":
          "radial-gradient(circle at 20% 20%, rgba(77,164,255,0.15), transparent 40%), radial-gradient(circle at 80% 0%, rgba(13,99,242,0.12), transparent 40%)",
      },
    },
  },
  plugins: [],
};
export default config;
