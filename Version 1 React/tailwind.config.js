/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#111613",
        "ink-soft": "#17695d",
        parchment: "#efe4d0",
        "parchment-soft": "#e1d1b5",
        sand: "#cdbfa7",
        bronze: "#d3a245",
        "bronze-deep": "#865425",
        sage: "#17695d",
        "sage-soft": "#d6e4d9",
        slate: "#5b554c",
        line: "rgba(17, 22, 19, 0.14)",
        muted: "#5b554c",
        primary: "#17695d",
        accent: "#c16039",
        gold: "#d3a245",
      },
      fontFamily: {
        sans: ["\"IBM Plex Sans\"", "\"Segoe UI\"", "system-ui", "sans-serif"],
        display: ["\"Big Shoulders Display\"", "\"IBM Plex Sans\"", "\"Segoe UI\"", "system-ui", "sans-serif"],
        mono: ["\"Azeret Mono\"", "\"SFMono-Regular\"", "monospace"],
      },
      boxShadow: {
        panel: "0 24px 80px rgba(2, 8, 18, 0.38)",
      },
      backgroundImage: {
        grid: "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
        hero: "radial-gradient(circle at 12% 0%, rgba(193, 96, 57, 0.26), transparent 28%), radial-gradient(circle at 88% 12%, rgba(23, 105, 93, 0.22), transparent 26%), linear-gradient(180deg, #efe4d0 0%, #e1d1b5 100%)",
        panel: "linear-gradient(180deg, rgba(247, 240, 228, 0.96), rgba(230, 218, 197, 0.92))",
        accent: "linear-gradient(145deg, rgba(193, 96, 57, 0.14), rgba(214, 228, 217, 0.9))",
        button: "linear-gradient(135deg, #17695d, #c16039)",
        teaser: "linear-gradient(145deg, rgba(23, 105, 93, 0.12), rgba(211, 162, 69, 0.24))",
        "rer-card": "linear-gradient(180deg, rgba(247,240,228,0.98), rgba(230,218,197,0.94))",
        "rer-card-soft": "linear-gradient(180deg, rgba(241,233,220,0.95), rgba(225,211,188,0.92))",
        "rer-gold": "linear-gradient(145deg, #d3a245, #865425)"
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
