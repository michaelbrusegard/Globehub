import HardDrive from '@material-symbols/svg-400/outlined/hard_drive.svg';
import { Button } from '@nextui-org/react';
import { useTranslations } from 'next-intl';

import { Link } from '@/lib/navigation';

export default function NotFound() {
  const t = useTranslations('error');
  return (
    <div className='flex min-h-screen flex-col items-center justify-center px-4'>
      <HardDrive className='mb-6 size-16 text-primary xs:mb-8 xs:size-24' />
      <h1 className='mb-3 text-3xl font-bold xs:mb-4 xs:text-4xl'>
        {t('notFound')}
      </h1>
      <p className='mb-6 text-lg text-default-200 xs:mb-8 xs:text-xl'>
        {t('notFoundDescription')}
      </p>
      <Button className='w-full xs:w-auto' as={Link} href='/'>
        {t('goToHome')}
      </Button>
    </div>
  );
}
