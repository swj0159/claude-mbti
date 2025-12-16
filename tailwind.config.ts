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
        surface: "var(--surface)",
        border: "var(--border)",
        // Minimal color palette - 절제된 색상
        primary: "#0F172A",      // Slate - 신뢰감과 안정감 (순수 검정보다 눈에 부드러움)
        accent: "#1E293B",       // Lighter slate for subtle elements
        muted: "#64748B",        // Slate gray for secondary text
        // MBTI Type Colors (유지)
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
      },
      fontFamily: {
        sans: ["Pretendard Variable", "Pretendard", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
      },
      fontSize: {
        // Larger, bolder typography scale
        'display-lg': ['7rem', { lineHeight: '1', fontWeight: '800', letterSpacing: '-0.02em' }],
        'display': ['5rem', { lineHeight: '1.1', fontWeight: '800', letterSpacing: '-0.02em' }],
        'heading-xl': ['3.5rem', { lineHeight: '1.1', fontWeight: '700', letterSpacing: '-0.01em' }],
        'heading-lg': ['2.5rem', { lineHeight: '1.2', fontWeight: '700', letterSpacing: '-0.01em' }],
        'heading': ['2rem', { lineHeight: '1.3', fontWeight: '600' }],
        'body-lg': ['1.25rem', { lineHeight: '1.6', fontWeight: '400' }],
        'body': ['1rem', { lineHeight: '1.7', fontWeight: '400' }],
        'caption': ['0.875rem', { lineHeight: '1.5', fontWeight: '400' }],
      },
      spacing: {
        // Generous spacing
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
        '34': '8.5rem',
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease-out",
        "slide-up": "slideUp 0.4s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
      transitionDuration: {
        'smooth': '250ms',
      },
    },
  },
  plugins: [],
};
export default config;
