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
      <h1 className='my-4 bg-gradient-to-br from-primary to-secondary bg-clip-text font-arimo text-4xl font-bold tracking-tight text-transparent lg:text-5xl'>
        {t('title')}
      </h1>
      <p className='mx-10 my-4 text-content2-foreground'>{t('description')}</p>
      {children}
    </>
  );
}
