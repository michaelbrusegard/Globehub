import createMiddleware from 'next-intl/middleware';
import { type NextRequest, NextResponse } from 'next/server';

import { defaultLocale, localePrefix, locales, pathnames } from '@/lib/config';

const BYPASS_PATHS = ['/s3/', '/api/'] as const;

const nextIntlMiddleware = createMiddleware({
  defaultLocale,
  localePrefix,
  locales,
  pathnames,
});

export async function middleware(request: NextRequest) {
  if (BYPASS_PATHS.some((path) => request.nextUrl.pathname.startsWith(path))) {
    return NextResponse.next();
  }
  return nextIntlMiddleware(request);
}

export const config = {
  matcher: ['/', '/no/:path*', '/((?!_next|.*\\..*).*)'],
};
