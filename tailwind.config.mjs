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
    /* Alt B scroll-reveal (clases toggled por JS; purga segura) */
    'opacity-0',
    'opacity-100',
    'translate-y-4',
    'translate-y-0',
    'transition-all',
    'duration-700',
  ],
  theme: {
    extend: {
      keyframes: {
        scroll: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        scroll: 'scroll 30s linear infinite',
      },
    },
  },
  plugins: [],
};
