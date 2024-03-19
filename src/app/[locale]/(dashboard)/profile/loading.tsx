import { Button, Skeleton } from '@nextui-org/react';
import { useTranslations } from 'next-intl';

export default function ProfileLoading() {
  const t = useTranslations('profile');
  return (
    <>
      <h1 className='my-4 bg-gradient-to-br from-primary to-secondary bg-clip-text font-arimo text-4xl font-bold tracking-tight text-transparent lg:text-5xl'>
        {t('myProfile')}
      </h1>
      <div className='mb-10 flex flex-col gap-0 sm:flex-row sm:gap-3'>
        <Skeleton className='mx-auto h-40 w-40 shrink-0 rounded-full sm:mx-0' />
        <div className='mt-4 flex-grow'>
          <div className='flex flex-row items-center justify-between'>
            <Skeleton className='my-2 h-6 w-full max-w-80 rounded-lg' />
            <Button variant='bordered' isDisabled>
              {t('edit')}
            </Button>
          </div>
          <Skeleton className='mx-2 my-2 h-4 w-5/6 rounded-full' />
          <Skeleton className='mx-2 my-2 h-4 w-full rounded-full' />
          <Skeleton className='mx-2 my-2 h-4 w-4/5 rounded-full' />
        </div>
      </div>
    </>
  );
}
