import { useTranslations } from 'next-intl';

export default function DestinationEditLoading() {
  const t = useTranslations('destination.write');
  return (
    <>
      <h1 className='mb-10 mt-4 bg-gradient-to-br from-primary to-secondary bg-clip-text font-arimo text-4xl font-bold tracking-tight text-transparent lg:text-5xl'>
        {t('editDestination')}
      </h1>
    </>
  );
}
