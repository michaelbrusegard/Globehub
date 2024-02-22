import { useTranslations } from 'next-intl';
import { unstable_setRequestLocale } from 'next-intl/server';

type HomeHeaderProps = {
  children: React.ReactNode;
  params: { locale: string };
};

export default function HomeHeader({
  children,
  params: { locale },
}: HomeHeaderProps) {
  unstable_setRequestLocale(locale);
  const t = useTranslations('home');
  return (
    <>
      <h1 className='my-4'>{t('title')}</h1>
      {children}
    </>
  );
}
