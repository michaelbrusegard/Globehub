import { useTranslations } from 'next-intl';

function Footer() {
  const t = useTranslations('layout');
  const year = new Date().getFullYear();
  return (
    <footer className='mx-auto w-full max-w-7xl px-12 pb-12'>
      <p className='text-center text-sm text-default-400'>
        {t('copyright')} &copy; {year}, Globehub. {t('allRightsReserved')}.
      </p>
    </footer>
  );
}

export { Footer };
