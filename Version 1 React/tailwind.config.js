/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0f1115",
        "ink-soft": "#253b80",
        parchment: "#ffffff",
        "parchment-soft": "#f6f8fc",
        sand: "#dde4ef",
        bronze: "#d9c47a",
        "bronze-deep": "#c8aa48",
        sage: "#3654a3",
        "sage-soft": "#ddf1e8",
        slate: "#6d7484",
        line: "rgba(37, 59, 128, 0.14)",
        muted: "#6d7484",
        primary: "#253b80",
        accent: "#3654a3",
        gold: "#c8aa48",
      },
      fontFamily: {
        sans: ["Aptos", "\"Segoe UI\"", "system-ui", "sans-serif"],
        display: ["\"Aptos Display\"", "Aptos", "\"Segoe UI\"", "system-ui", "sans-serif"],
      },
      boxShadow: {
        panel: "0 24px 80px rgba(2, 8, 18, 0.38)",
      },
      backgroundImage: {
        grid: "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
        hero: "radial-gradient(circle at 10% 0%, rgba(37, 59, 128, 0.18), transparent 28%), radial-gradient(circle at 90% 10%, rgba(221, 241, 232, 0.92), transparent 26%), linear-gradient(180deg, #ffffff 0%, #f6f8fc 100%)",
        panel: "linear-gradient(180deg, rgba(255, 255, 255, 0.96), rgba(246, 248, 252, 0.92))",
        accent: "linear-gradient(145deg, rgba(37, 59, 128, 0.12), rgba(221, 241, 232, 0.9))",
        button: "linear-gradient(135deg, #253b80, #3654a3)",
        teaser: "linear-gradient(145deg, rgba(37, 59, 128, 0.14), rgba(221, 241, 232, 0.82))",
        "rer-card": "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(246,248,252,0.94))",
        "rer-card-soft": "linear-gradient(180deg, rgba(255,255,255,0.94), rgba(248,250,253,0.9))",
        "rer-gold": "linear-gradient(145deg, #d9c47a, #c8aa48)"
      },
      animation: {
        ticker: "ticker 24s linear infinite",
        float: "float 6s ease-in-out infinite",
        pulseSoft: "pulseSoft 3.2s ease-out infinite",
      },
      keyframes: {
        ticker: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        pulseSoft: {
          "0%": { opacity: "0.8", transform: "scale(0.72)" },
          "100%": { opacity: "0", transform: "scale(2)" },
        },
      },
    },
  },
  plugins: [],
};
