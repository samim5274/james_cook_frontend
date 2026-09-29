/** @type {import('tailwindcss').Config} */

import typography from '@tailwindcss/typography'

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{vue,js,ts}"],
  theme: {
    extend: {},
  },
  plugins: [
    typography,
  ],
}

