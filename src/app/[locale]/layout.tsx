import type { Viewport } from 'next';
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import { Arimo, Inter } from 'next/font/google';
import { notFound } from 'next/navigation';

import { locales } from '@/lib/config';

import { RootProviders } from '@/components/providers/RootProviders';

type LocalelayoutProps = {
  children: React.ReactNode;
  params: { locale: string };
};

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const arimo = Arimo({
  subsets: ['latin'],
  variable: '--font-arimo',
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  colorScheme: 'dark light',
  themeColor: '#004493',
};

export async function generateMetadata({
  params: { locale },
}: Omit<LocalelayoutProps, 'children'>) {
  const t = await getTranslations({ locale, namespace: 'meta' });
  return {
    applicationName: t('title'),
    title: {
      template: '%s | ' + t('title'),
      default: t('title'),
    },
    description: t('description'),
    icons: [
      {
        rel: 'icon',
        type: 'image/x-icon',
        url: '/favicon/favicon.ico',
      },
      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        url: '/favicon/apple-touch-icon.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        url: '/favicon/favicon-32x32.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        url: '/favicon/favicon-16x16.png',
      },
      { rel: 'manifest', url: '/favicon/site.webmanifest' },
    ],
    meta: [
      { name: 'msapplication-TileColor', content: '#4C8BEF' },
      { name: 'theme-color', content: '#4C8BEF' },
    ],
  };
}

export default function LocaleLayout({
  children,
  params: { locale },
}: LocalelayoutProps) {
  if (!locales.includes(locale)) notFound();
  unstable_setRequestLocale(locale);
  return (
    <html
      className={`h-full w-full ${inter.variable} ${arimo.variable}`}
      lang={locale}
      dir='ltr'
      suppressHydrationWarning
    >
      <body className='h-full w-full bg-background font-inter text-foreground antialiased'>
        <RootProviders
          className='fixed bottom-0 top-0 flex h-full w-full flex-col overflow-y-scroll scroll-smooth scrollbar-thin scrollbar-track-background scrollbar-thumb-warning-300 scrollbar-corner-background scrollbar-thumb-rounded-full hover:scrollbar-thumb-warning-400'
          locale={locale}
        >
          {children}
        </RootProviders>
      </body>
    </html>
  );
}
