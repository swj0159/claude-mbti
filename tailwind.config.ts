import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "#4A90E2",
        "primary-dark": "#3A7BC8",
        secondary: "#7B68EE",
        success: "#28A745",
        warning: "#FFC107",
        error: "#DC3545",
        info: "#17A2B8",
        // MBTI Type Colors
        intj: "#6A5ACD",
        intp: "#20B2AA",
        entj: "#191970",
        entp: "#FF8C00",
        infj: "#9370DB",
        infp: "#FFB6C1",
        enfj: "#FF7F50",
        enfp: "#FFD700",
        istj: "#8B4513",
        isfj: "#DEB887",
        estj: "#2F4F2F",
        esfj: "#9ACD32",
        istp: "#708090",
        isfp: "#E6E6FA",
        estp: "#DC143C",
        esfp: "#FF69B4",
        // Gray scale
        "gray-100": "#F8F9FA",
        "gray-200": "#E9ECEF",
        "gray-300": "#DEE2E6",
        "gray-500": "#ADB5BD",
        "gray-700": "#495057",
        "gray-900": "#212529",
      },
      fontFamily: {
        sans: ["Pretendard", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
      },
      animation: {
        "slide-up": "slideUp 0.3s ease-out",
        "fade-in": "fadeIn 0.3s ease-out",
        "progress": "progress 1s ease-out",
      },
      keyframes: {
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        progress: {
          "0%": { width: "0%" },
          "100%": { width: "var(--progress-width)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
