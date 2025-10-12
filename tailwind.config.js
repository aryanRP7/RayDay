/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        pastelPink: "#FFD1DC",
        pastelYellow: "#FFF6A9",
        softWhite: "#FFFDF9",
        sunflower: "#FFC300",
      },
      fontFamily: {
        fairy: ['"Great Vibes"', "cursive"],
        cute: ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [],
};
