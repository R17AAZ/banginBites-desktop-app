/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#CE7A07",
          50: "#FFF9F0",
          100: "#FFF2DB",
          200: "#FFE0A3",
          300: "#FFC96B",
          400: "#FFA833",
          500: "#CE7A07", // Primary Golden Orange
          600: "#A66206",
          700: "#804B05",
          800: "#593503",
          900: "#331E02",
        },
        surface: "#FFFFFF",
        neutral: {
          50: "#F9FAFB",
          100: "#F3F4F6",
          200: "#E5E7EB",
          300: "#D1D5DB",
          400: "#9CA3AF",
          500: "#6B7280",
          600: "#4B5563",
          700: "#374151",
          800: "#1F2937",
          900: "#111827",
        }
      },
      fontFamily: {
        heading: ["Inter", "sans-serif"],
        sans: ["Inter", "sans-serif"],
      },
      borderRadius: {
        'none': '0',
        'sm': '2px',
        DEFAULT: '4px',
        'md': '6px',
        'lg': '8px',
        'xl': '12px',
        '2xl': '16px',
        '3xl': '24px',
        'full': '9999px',
      }
    },
  },
  plugins: [],
}
