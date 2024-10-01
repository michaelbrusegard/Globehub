'use client';

import Warning from '@material-symbols/svg-400/outlined/warning.svg';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';

import { GoHomeButton } from '@/components/error/GoHomeButton';

export default function Error({ error }: { error: Error }) {
  const t = useTranslations('error');
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <div className='flex min-h-screen flex-col items-center justify-center px-4'>
      <Warning className='mb-6 size-16 text-warning xs:mb-8 xs:size-24' />
      <h1 className='mb-3 text-3xl font-bold xs:mb-4 xs:text-4xl'>
        {t('serverError')}
      </h1>
      <p className='mb-6 text-lg text-default-200 xs:mb-8 xs:text-xl'>
        {t('serverErrorDescription')}
      </p>
      <GoHomeButton t={{ goToHome: t('goToHome') }} />
    </div>
  );
}
