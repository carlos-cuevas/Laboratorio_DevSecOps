import type { Config } from 'tailwindcss';

export default {
  darkMode: 'selector',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/tools/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'rgb(var(--color-background))',
        foreground: 'rgb(var(--color-foreground))',
        backgroundDark: 'rgb(var(--color-background-dark))',
        foregroundDark: 'rgb(var(--color-foreground-dark), 0.87)',
      },
    },
  },
  plugins: [],
} satisfies Config;
