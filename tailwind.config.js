/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
 
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#000000',
        'background-secondary': '#0C0C0C',
        'background-tertiary': '#1A1A1A',
        'text-primary': '#FFFFFF',
        'text-secondary': '#9A9A9A',
        accent: '#F0B90B',
        'border-neutral': '#E6E6E6',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        heading: ['var(--font-manrope)', 'sans-serif'],
      },
      borderRadius: {
        'lg': '12px',
      }
    },
  },
  plugins: [],
}