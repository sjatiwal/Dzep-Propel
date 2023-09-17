/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        "custom-blue": "#F5F6FA",
        "custom-red": "#DC5040",
        "custom-darkBlue": "#1F389E",
        "custom-purple": "#6944BA",
        "custom-grey-text": "#505877",
        "custom-grey-index": "#999999",
        "custom-bg-grey": "#F7F7F7",
        "custom-grey-border": "#E4E4E3",
      },
    },
  },
  plugins: [],
};
