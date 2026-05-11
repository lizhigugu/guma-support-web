import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        montserrat: ["var(--font-montserrat)", "system-ui", "sans-serif"],
        "noto-tc": ["var(--font-noto-sans-tc)", "sans-serif"],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        "hle-orange": "#FF6B00",
        /** 漸層末端，用於暗色模式下連結等高亮 */
        "hle-orange-bright": "#FF9E00",
        /** 按鈕 hover／按下，略深於主橘 */
        "hle-orange-hover": "#E65F00",
        "hle-gray": "#F5F5F7",
      },
      backgroundImage: {
        "hle-gradient":
          "linear-gradient(135deg, #FF6B00 0%, #FF9E00 100%)",
      },
      boxShadow: {
        "hle-card": "0 8px 30px rgba(0, 0, 0, 0.04)",
      },
      keyframes: {
        floatOrb: {
          "0%, 100%": { transform: "translate(0, 0) scale(1)", opacity: "0.55" },
          "50%": { transform: "translate(12px, -18px) scale(1.06)", opacity: "0.95" },
        },
        giftBob: {
          "0%, 100%": { transform: "translateY(0) rotate(-2deg)" },
          "50%": { transform: "translateY(-8px) rotate(2deg)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "0.82" },
          "50%": { opacity: "1" },
        },
        fadeRise: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "float-orb": "floatOrb 14s ease-in-out infinite",
        "float-orb-rev": "floatOrb 18s ease-in-out infinite reverse",
        "gift-bob": "giftBob 1.65s ease-in-out infinite",
        "pulse-soft": "pulseSoft 2s ease-in-out infinite",
        "fade-rise": "fadeRise 0.55s ease-out both",
      },
    },
  },
  plugins: [],
};
export default config;
