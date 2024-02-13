import createMiddleware from 'next-intl/middleware';

import { auth } from '@/lib/auth';
import { defaultLocale, localePrefix, locales, pathnames } from '@/lib/config';

const intlMiddleware = createMiddleware({
  defaultLocale,
  localePrefix,
  locales,
  pathnames,
});

export default auth((req) => {
  return intlMiddleware(req);
});

export const config = {
  matcher: ['/', '/no/:path*', '/((?!api|_next|.*\\..*).*)'],
};
