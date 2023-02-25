/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        dark: "#222222",
        "dark-lightened": "#2F2F2F",
        primary: "#2374E1",
      },
    },
  },
  plugins: [],
};
