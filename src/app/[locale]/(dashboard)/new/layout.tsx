import { useTranslations } from 'next-intl';
import { unstable_setRequestLocale } from 'next-intl/server';

type EditDestinationHeaderProps = {
  children: React.ReactNode;
  params: { locale: string };
};

export default function NewDestinationHeader({
  children,
  params: { locale },
}: EditDestinationHeaderProps) {
  unstable_setRequestLocale(locale);
  const t = useTranslations('destination.write');
  return (
    <>
      <h1 className='mb-10 mt-4 bg-gradient-to-br from-primary to-secondary bg-clip-text font-arimo text-4xl font-bold tracking-tight text-transparent lg:text-5xl'>
        {t('newDestination')}
      </h1>
      {children}
    </>
  );
}
