import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary - Vibrant Orange (Amazon-inspired)
        primary: {
          50: "#FFF8F0",
          100: "#FFECD6",
          200: "#FFD4A8",
          300: "#FFB870",
          400: "#FF9900", // Main primary
          500: "#E68A00",
          600: "#CC7A00",
          700: "#A36200",
          800: "#7A4A00",
          900: "#523200",
        },
        // Secondary - Deep Navy
        secondary: {
          50: "#E8EBF0",
          100: "#C7CDD9",
          200: "#9DABC2",
          300: "#6E84A3",
          400: "#4A6484",
          500: "#37475A", // Main secondary
          600: "#2E3B4E",
          700: "#232F3E", // Dark navy
          800: "#1A2332",
          900: "#0F1419",
        },
        // Accent - Teal Success
        accent: {
          50: "#E6F7F4",
          100: "#C2EBE3",
          200: "#8DD9CC",
          300: "#52C4B0",
          400: "#1AAF93",
          500: "#067D62", // Main accent
          600: "#056B54",
          700: "#045847",
          800: "#034539",
          900: "#02322B",
        },
        // Surface colors
        surface: {
          50: "#FFFFFF",
          100: "#FAFBFC",
          200: "#F7F8FA",
          300: "#EAECF0",
          400: "#D5D9D9",
        },
        // Text colors
        text: {
          primary: "#0F1111",
          secondary: "#565959",
          muted: "#8C8C8C",
          inverse: "#FFFFFF",
        },
        // Semantic colors
        success: "#067D62",
        warning: "#F3A847",
        error: "#C7511F",
        info: "#0066C0",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Outfit", "system-ui", "sans-serif"],
      },
      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "0.875rem" }],
      },
      spacing: {
        "18": "4.5rem",
        "88": "22rem",
        "128": "32rem",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      boxShadow: {
        "soft": "0 2px 8px -2px rgba(0, 0, 0, 0.08), 0 4px 16px -4px rgba(0, 0, 0, 0.08)",
        "medium": "0 4px 12px -2px rgba(0, 0, 0, 0.1), 0 8px 24px -4px rgba(0, 0, 0, 0.1)",
        "strong": "0 8px 24px -4px rgba(0, 0, 0, 0.12), 0 16px 48px -8px rgba(0, 0, 0, 0.12)",
        "glow": "0 0 20px rgba(255, 153, 0, 0.3)",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-out",
        "slide-up": "slideUp 0.3s ease-out",
        "slide-down": "slideDown 0.3s ease-out",
        "slide-left": "slideLeft 0.3s ease-out",
        "slide-right": "slideRight 0.3s ease-out",
        "scale-in": "scaleIn 0.2s ease-out",
        "bounce-subtle": "bounceSubtle 0.4s ease-out",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideDown: {
          "0%": { opacity: "0", transform: "translateY(-10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideLeft: {
          "0%": { opacity: "0", transform: "translateX(10px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        slideRight: {
          "0%": { opacity: "0", transform: "translateX(-10px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        bounceSubtle: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-4px)" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 5px rgba(255, 153, 0, 0.3)" },
          "50%": { boxShadow: "0 0 20px rgba(255, 153, 0, 0.6)" },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "hero-pattern": "linear-gradient(135deg, #232F3E 0%, #37475A 50%, #4A6484 100%)",
        "cta-gradient": "linear-gradient(135deg, #FF9900 0%, #FFB870 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
