import { type Pathnames } from 'next-intl/navigation';

const locales = ['en', 'no'];
const defaultLocale = 'no';
const localePrefix = 'as-needed';

const pathnames = {
  '/': '/',
  '/[destination]': {
    en: '/[destination]',
    no: '/[destination]',
  },
  '/signin': {
    en: '/signin',
    no: '/logginn',
  },
  '/profile': {
    en: '/profile',
    no: '/profil',
  },
} satisfies Pathnames<typeof locales>;

export { locales, defaultLocale, localePrefix, pathnames };
