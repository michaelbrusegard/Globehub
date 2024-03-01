import { Pagination } from '@nextui-org/react';

import { TopDestinationsGridSkeleton } from '@/components/home/TopDestinationsGridSkeleton';

export default function NewsSkeleton() {
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
    </>
  );
}
