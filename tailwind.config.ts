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
        // Primary - Electric Blue (Levitation/Trust)
        primary: {
          50: "#E6F2FF",
          100: "#CCE5FF",
          200: "#99CCFF",
          300: "#66B2FF",
          400: "#3399FF",
          500: "#007BFF", // Main primary
          600: "#0062CC",
          700: "#004999",
          800: "#003166",
          900: "#001833",
        },
        // Secondary - Deep Space (Backgrounds)
        secondary: {
          50: "#E6E6ED",
          100: "#C1C1D1",
          200: "#9898B0",
          300: "#6E6E8E",
          400: "#4D4D6B",
          500: "#2E2E4D",
          600: "#23233A",
          700: "#1A1A2E", // Darker space
          800: "#0A0A2E", // Deep space void
          900: "#050510", // Almost black
        },
        // Accent - Neon Green (Energy/Magnetic)
        accent: {
          50: "#E6FFF3",
          100: "#B3FFE0",
          200: "#80FFCC",
          300: "#4DFFB8",
          400: "#1AFF9F",
          500: "#00FF88", // Main neon green
          600: "#00CC6D",
          700: "#009952",
          800: "#006636",
          900: "#00331B",
        },
        // Surface colors - Metallic/Dark
        surface: {
          50: "#FFFFFF",
          100: "#F5F5F7", // Light silver
          200: "#E0E0E5",
          300: "#2E2E4D", // Dark card bg
          400: "#1A1A2E", // Darker card bg
        },
        // Text colors
        text: {
          primary: "#FFFFFF", // Default to white for dark theme
          secondary: "#B0B0C0", // Light grey
          muted: "#6E6E8E",    // Muted purple/grey
          inverse: "#0A0A2E",  // Dark text for light bg
        },
        // Semantic colors
        success: "#00FF88",
        warning: "#FFD700", // Gold
        error: "#FF3366",   // Neon red
        info: "#00C2FF",    // Cyan
      },
      fontFamily: {
        sans: ["Poppins", "system-ui", "sans-serif"],
        display: ["Orbitron", "system-ui", "sans-serif"],
      },
      // ... keep existing spacings/animations ...
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
        "soft": "0 2px 8px -2px rgba(0, 0, 0, 0.3), 0 4px 16px -4px rgba(0, 0, 0, 0.3)",
        "medium": "0 4px 12px -2px rgba(0, 0, 0, 0.5), 0 8px 24px -4px rgba(0, 0, 0, 0.5)",
        "strong": "0 8px 24px -4px rgba(0, 0, 0, 0.6), 0 16px 48px -8px rgba(0, 0, 0, 0.6)",
        "glow": "0 0 20px rgba(0, 255, 136, 0.3)",
      },
      animation: {
        "float": "float 6s ease-in-out infinite",
        "levitate": "levitate 5s ease-in-out infinite",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
        "shimmer": "shimmer 2s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" },
        },
        levitate: {
          "0%": { transform: "translateY(0) rotate(0deg)" },
          "100%": { transform: "translateY(-10px) rotate(2deg)" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 5px rgba(0, 255, 136, 0.2)" },
          "50%": { boxShadow: "0 0 20px rgba(0, 255, 136, 0.6)" },
        },
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
      },
      backgroundImage: {
        "space-gradient": "linear-gradient(135deg, #0A0A2E 0%, #1A1A3E 50%, #000000 100%)",
        "neon-gradient": "linear-gradient(to right, #007BFF, #00FF88)",
      },
    },
  },
  plugins: [],
};

export default config;
