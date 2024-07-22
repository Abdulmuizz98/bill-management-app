/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      sans: ["Satoshi", "sans-serif"],
    },
    colors: {
      white: "#ffffff", // white
      black: "#000000", // black
      offwhite: "#FCFCFD", // gray-25
      offblack: "#101828", // gray-900
      purple: "#5F2EEA", // purple-500
      midpurple: "#DFD5FB", // purple-50
      lightpurple: "#EFEAFD", // purple-25
      gray: "#475467", // gray-600
      midgray: "#667085", // gray-500
      lightgray: "#F2F4F7", // gray-100
    },
    extend: {},
  },
  plugins: [],
};
