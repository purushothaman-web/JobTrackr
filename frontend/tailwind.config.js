/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'heading': ['"Space Grotesk"', 'sans-serif'],
        'body': ['Inter', 'sans-serif'],
        'mono': ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        obsidian: {
          DEFAULT: '#09090b',
          light: '#18181b',
        },
        border: '#27272a',
        offwhite: '#fafafa',
        electric: {
          DEFAULT: '#c0ff00',
          hover: '#a3d900',
        }
      }
    },
  },
  plugins: [],
}
