import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1.25rem",
        sm: "1.5rem",
        lg: "2rem",
      },
      screens: {
        "2xl": "1280px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        brand: {
          DEFAULT: "#F05555",
          50: "#FEF1F1",
          100: "#FDDDDD",
          200: "#FABEBE",
          300: "#F59595",
          400: "#F27070",
          500: "#F05555",
          600: "#E23F3F",
          700: "#C23030",
          800: "#9A2727",
          900: "#721E1E",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-sans)", "sans-serif"],
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      transitionTimingFunction: {
        // Expo-out: fast departure, gentle settle, no bounce. The house curve
        // for interactive surfaces. A named token rather than an arbitrary
        // value — `ease-[cubic-bezier(...)]` parses as ambiguous and silently
        // emits no CSS at all.
        premium: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      maxWidth: {
        "8xl": "88rem",
      },
      boxShadow: {
        soft: "0 1px 2px -1px rgba(0,0,0,0.06), 0 10px 30px -14px rgba(0,0,0,0.18)",
        elevated:
          "0 2px 4px -2px rgba(0,0,0,0.08), 0 24px 56px -20px rgba(0,0,0,0.30)",
        glow: "0 0 0 1px rgba(220,38,38,0.16), 0 20px 60px -20px rgba(220,38,38,0.45)",
        "glow-sm":
          "0 0 0 1px rgba(220,38,38,0.18), 0 10px 28px -12px rgba(220,38,38,0.40)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(0.8)", opacity: "0.6" },
          "100%": { transform: "scale(2.2)", opacity: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.25s ease-out",
        "accordion-up": "accordion-up 0.25s ease-out",
        marquee: "marquee 40s linear infinite",
        float: "float 6s ease-in-out infinite",
        "pulse-ring": "pulse-ring 2.4s cubic-bezier(0.4,0,0.6,1) infinite",
      },
    },
  },
  plugins: [tailwindcssAnimate],
};

export default config;
