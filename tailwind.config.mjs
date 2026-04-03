/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  darkMode: 'class',
  safelist: [
    'fixed',
    'inset-0',
    'z-50',
    'bg-black',
    'flex',
    'items-center',
    'justify-center',
    'w-full',
    'max-w-full',
    'min-w-0',
    'overflow-x-hidden',
    'box-border',
    'p-2',
    'h-full',
    'overflow-hidden',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
