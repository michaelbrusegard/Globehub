import { nextui } from '@nextui-org/react';
import tailwindScrollbar from 'tailwind-scrollbar';
import { type Config } from 'tailwindcss';
import tailwindAnimate from 'tailwindcss-animate';
import { fontFamily } from 'tailwindcss/defaultTheme';

const config = {
  content: [
    './src/**/*.tsx',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        inter: ['var(--font-inter)', ...fontFamily.sans],
        arimo: ['var(--font-arimo)', ...fontFamily.sans],
      },
      screens: {
        xs: '480px',
      },
    },
  },
  plugins: [
    nextui({
      addCommonColors: true,
      defaultTheme: 'light',
      defaultExtendTheme: 'light',
      layout: {},
    }),
    tailwindAnimate,
    tailwindScrollbar({ nocompatible: true }),
  ],
} satisfies Config;

export default config;
