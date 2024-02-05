import { type Pathnames } from 'next-intl/navigation';

const locales = ['no'];
const defaultLocale = 'no';
const localePrefix = 'as-needed';

const pathnames = {
  '/': '/',
  '/[destination]': {
    no: '/[destination]',
  },
  '/signin': {
    no: '/logg-inn',
  },
  '/profile': {
    no: '/profil',
  },
} satisfies Pathnames<typeof locales>;

export { locales, defaultLocale, localePrefix, pathnames };
