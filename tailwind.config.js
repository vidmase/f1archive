/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        michroma: ['Michroma', 'sans-serif'],
        'yanone-kaffeesatz': ['"Yanone Kaffeesatz"', 'sans-serif'],
      },
      // animation classes
      animation: {
        fade: "fadeIn 4s ease-in-out",
        fadeInQuick: "fadeIn 2s ease-in-out",
      },

      // actual animation
      keyframes: (theme) => ({
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 90 },
        },
      }),
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
};
