import { Pagination, Skeleton } from '@nextui-org/react';
import { useTranslations } from 'next-intl';

import { TopDestinationsGridSkeleton } from '@/components/home/TopDestinationsGridSkeleton';

export default function HomeLoading() {
  const t = useTranslations('home');
  return (
    <>
      <div className='flex flex-col items-center'>
        <TopDestinationsGridSkeleton />
        <Pagination
          className='my-6'
          total={5}
          showControls
          isDisabled
          color='secondary'
        />
      </div>
      <div className='mb-12'>
        <h2 className='my-4 bg-gradient-to-br from-primary to-secondary bg-clip-text font-arimo text-3xl font-bold tracking-tight text-transparent lg:text-4xl'>
          {t('filterTitle')}
        </h2>
        <div className='mb-2 flex gap-2'>
          <Skeleton className='h-12 w-2/3 rounded-medium' />
          <Skeleton className='h-12 w-full rounded-medium' />
        </div>
      </div>
    </>
  );
}
