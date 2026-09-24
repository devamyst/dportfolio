import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    borderRadius: {
      none: "0",
      sm: "0",
      DEFAULT: "0",
      md: "0",
      lg: "0",
      xl: "0",
      "2xl": "0",
      "3xl": "0",
      full: "0",
    },
    extend: {
      colors: {
        bg: "#0d0e14",
        surface: "#1c1c22",
        surface2: "#27272e",
        border: "#3b3b44",
        accent: "#5dbb3f",
        accentDark: "#3f8f2a",
        accent2: "#fcc72b",
        accent3: "#4aedd9",
        accent4: "#e0443a",
        dirt: "#866043",
        dirtDark: "#5c4030",
        grass: "#5dbb3f",
        xp: "#80ff20",
        enchant: "#a47cff",
        stone: "#8b8b8b",
        night: "#07080f",
        night2: "#0e1230",
        night3: "#1a1a3a",
        moon: "#e8ecd8",
        moonShade: "#c9ceb6",
        hill: "#0a0b12",
        hillTop: "#1d3a17",
      },
      fontFamily: {
        pixel: ["var(--font-pixel)", "monospace"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      keyframes: {
        splash: {
          "0%, 100%": { transform: "rotate(-18deg) scale(1)" },
          "50%": { transform: "rotate(-18deg) scale(1.08)" },
        },
        drift: {
          "0%": { transform: "translateX(-30vw)" },
          "100%": { transform: "translateX(130vw)" },
        },
        bob: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        xpShift: {
          "0%, 100%": { filter: "brightness(1)" },
          "50%": { filter: "brightness(1.35)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        splash: "splash 0.9s ease-in-out infinite",
        drift: "drift 140s linear infinite",
        bob: "bob 3s ease-in-out infinite",
        xpShift: "xpShift 2s ease-in-out infinite",
        marquee: "marquee 17.5s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
