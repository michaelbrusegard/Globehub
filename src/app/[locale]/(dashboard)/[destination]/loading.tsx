import { Skeleton } from '@nextui-org/react';

import { SubHeaderSkeleton } from '@/components/destination/SubHeaderSkeleton';

export default function DestinationLoading() {
  return (
    <article className='mt-12'>
      <section>
        <div className='mb-14 pt-0.5 md:pt-0'>
          <Skeleton className='mx-auto my-[3px] h-[30px] w-1/2 rounded-lg md:mx-0 md:my-0 md:h-[60px] lg:h-[72px] ' />
        </div>
        <SubHeaderSkeleton className='hidden md:mb-12 md:inline-flex' />
        <div className='mb-4'>
          <Skeleton className='mx-auto aspect-[4/3] max-w-3xl overflow-hidden rounded-md' />
          <div className='mt-3 flex justify-center overflow-hidden'>
            <div className='flex flex-row gap-3 p-1'>
              {Array.from({ length: 5 }).map((_, index) => (
                <div className='shrink-0' key={index}>
                  <Skeleton className='aspect-video h-14 rounded-medium' />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className='mx-auto max-w-2xl'>
          <SubHeaderSkeleton className='mb-6 flex md:hidden' />
          <Skeleton className='mb-2' />
          <div className='mb-2 flex flex-wrap'>
            <Skeleton className='mb-2 mr-2 h-7 w-16 rounded-full' />
            <Skeleton className='mb-2 mr-2 h-7 w-14 rounded-full' />
            <Skeleton className='mb-2 mr-2 h-7 w-16 rounded-full' />
            <Skeleton className='mb-2 mr-2 h-7 w-20 rounded-full' />
            <Skeleton className='mb-2 mr-2 h-7 w-14 rounded-full' />
          </div>
          <Skeleton className='my-[5px] mb-6 h-[18px] w-44 rounded-full text-lg' />
        </div>
      </section>
      <div className='mx-auto mb-10 min-h-screen max-w-2xl space-y-1'>
        <Skeleton className='h-4 w-3/4 rounded' />
        <Skeleton className='h-4 w-1/2 rounded' />
        <Skeleton className='h-4 w-5/6 rounded' />
        <Skeleton className='h-4 w-4/5 rounded' />
        <Skeleton className='h-4 w-2/3 rounded' />
        <Skeleton className='h-4 w-3/4 rounded' />
        <Skeleton className='h-4 w-1/2 rounded' />
        <Skeleton className='h-4 w-4/5 rounded' />
        <Skeleton className='h-4 w-2/3 rounded' />
        <Skeleton className='h-4 w-5/6 rounded' />
      </div>
    </article>
  );
}
