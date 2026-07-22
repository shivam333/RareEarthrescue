/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#151714",
        "ink-soft": "#1b5d52",
        parchment: "#f1eadf",
        "parchment-soft": "#e8ddca",
        sand: "#d7cfbf",
        bronze: "#ca9730",
        "bronze-deep": "#8f5c22",
        sage: "#1b5d52",
        "sage-soft": "#dce8db",
        slate: "#5c5b54",
        line: "rgba(21, 23, 20, 0.12)",
        muted: "#5c5b54",
        primary: "#1b5d52",
        accent: "#b85c38",
        gold: "#ca9730",
      },
      fontFamily: {
        sans: ["\"IBM Plex Sans\"", "\"Segoe UI\"", "system-ui", "sans-serif"],
        display: ["Oxanium", "\"IBM Plex Sans\"", "\"Segoe UI\"", "system-ui", "sans-serif"],
        mono: ["\"IBM Plex Mono\"", "\"SFMono-Regular\"", "monospace"],
      },
      boxShadow: {
        panel: "0 24px 80px rgba(2, 8, 18, 0.38)",
      },
      backgroundImage: {
        grid: "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
        hero: "radial-gradient(circle at 12% 0%, rgba(184, 92, 56, 0.24), transparent 28%), radial-gradient(circle at 88% 12%, rgba(27, 93, 82, 0.22), transparent 26%), linear-gradient(180deg, #f1eadf 0%, #e8ddca 100%)",
        panel: "linear-gradient(180deg, rgba(248, 243, 234, 0.96), rgba(235, 226, 210, 0.92))",
        accent: "linear-gradient(145deg, rgba(184, 92, 56, 0.14), rgba(220, 232, 219, 0.9))",
        button: "linear-gradient(135deg, #1b5d52, #b85c38)",
        teaser: "linear-gradient(145deg, rgba(27, 93, 82, 0.12), rgba(202, 151, 48, 0.22))",
        "rer-card": "linear-gradient(180deg, rgba(248,243,234,0.98), rgba(235,226,210,0.94))",
        "rer-card-soft": "linear-gradient(180deg, rgba(245,238,228,0.95), rgba(234,224,208,0.92))",
        "rer-gold": "linear-gradient(145deg, #ca9730, #8f5c22)"
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
