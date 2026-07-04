/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx}"],
  theme: {
    extend: {
      colors: {
        emerald: {
          DEFAULT: "#0B3D2E",
          deep: "#0B3D2E",
          mid: "#12513B",
          soft: "#2F6B52",
        },
        charcoal: {
          DEFAULT: "#1C1C1A",
          soft: "#33322E",
        },
        paper: {
          DEFAULT: "#F7F5EF",
          warm: "#EFEBE1",
        },
        clay: {
          DEFAULT: "#B4643C",
          soft: "#C9855F",
        },
      },
      fontFamily: {
        serif: ["Fraunces", "Georgia", "Cambria", "serif"],
        sans: ["Inter", "system-ui", "Segoe UI", "sans-serif"],
      },
      fontSize: {
        "display": ["clamp(2.6rem, 5vw, 4.2rem)", { lineHeight: "1.02", letterSpacing: "-0.02em" }],
        "eyebrow": ["0.78rem", { lineHeight: "1.2", letterSpacing: "0.14em" }],
      },
      maxWidth: {
        prose: "68ch",
        page: "1200px",
      },
      borderColor: {
        rule: "rgba(28,28,26,0.14)",
      },
    },
  },
  plugins: [],
};
