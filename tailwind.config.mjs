/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/Navbar/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#3B82F6", // blue-600
        secondary: "#1F2937", // gray-800
        accent: "#60A5FA", // blue-400
        background: "#FFFFFF",
        foreground: "#111827", // gray-900
      },
    },
  },
  plugins: [],
};

export default config;
