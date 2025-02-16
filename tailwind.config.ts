import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "background-primary": "#fff",
        "content-body": "#fff",
        "content-placeholder": "#A4A4A4",
        "content-headline": "#63605C",
        "border-primary": "#63605C",
        "border-secondary": "#E6E6E6",
        "accent-green": "#115740",
        "accent-black": "#1A1C28"
      },
    },
  },
  plugins: [],
} satisfies Config;
