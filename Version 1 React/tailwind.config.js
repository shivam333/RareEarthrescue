/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#081220",
        "ink-soft": "#0f1d2f",
        line: "rgba(154, 180, 212, 0.16)",
        muted: "#95a9c4",
        primary: "#5487ff",
        accent: "#18a999",
        gold: "#bf9a62",
      },
      fontFamily: {
        sans: ["Manrope", "sans-serif"],
        display: ["Plus Jakarta Sans", "sans-serif"],
      },
      boxShadow: {
        panel: "0 24px 80px rgba(2, 8, 18, 0.38)",
      },
      backgroundImage: {
        grid: "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
        hero: "radial-gradient(circle at 10% 0%, rgba(84, 135, 255, 0.18), transparent 28%), radial-gradient(circle at 90% 10%, rgba(24, 169, 153, 0.16), transparent 24%), linear-gradient(180deg, #081220 0%, #0a1524 100%)",
        panel: "linear-gradient(180deg, rgba(16, 29, 49, 0.96), rgba(10, 20, 34, 0.92))",
        accent: "linear-gradient(145deg, rgba(84, 135, 255, 0.18), rgba(24, 169, 153, 0.16))",
        button: "linear-gradient(135deg, #5487ff, #315fce)",
        teaser: "linear-gradient(145deg, rgba(84, 135, 255, 0.2), rgba(24, 169, 153, 0.16))"
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
