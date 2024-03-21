import { Card, Skeleton, Spacer } from '@nextui-org/react';

function FormSkeleton() {
  return (
    <div className='mb-12 space-y-4'>
      <div>
        <Skeleton className='absolute my-1 h-5 w-14 -translate-y-8 rounded-large' />
        <Skeleton className='h-12 w-full rounded-large' />
      </div>
      <div>
        <div className='mb-2'>
          <Skeleton className='my-1 h-4 w-16 rounded-large' />
        </div>
        <Skeleton className='h-14 max-w-[336px] rounded-large' />
      </div>
      <div className='flex gap-4'>
        <Skeleton className='h-14 w-full max-w-40 rounded-large' />
        <Skeleton className='h-14 w-full max-w-40 rounded-large' />
      </div>
      <Spacer y={6} />
      <div>
        <Skeleton className='absolute my-1 h-4 w-16 -translate-y-7 rounded-large' />
        <Skeleton className='h-52 w-full rounded-large' />
        <div className='p-1'>
          <Skeleton className='my-0.5 h-3 w-full rounded-full' />
          <Skeleton className='my-0.5 h-3 w-5/6 rounded-full' />
        </div>
      </div>
      <Spacer y={6} />
      <div>
        <Skeleton className='absolute my-1 h-4 w-32 -translate-y-7 rounded-large' />
        <Skeleton className='h-52 w-full rounded-large' />
        <div className='p-1'>
          <Skeleton className='my-0.5 h-3 w-3/4 rounded-full' />
          <Skeleton className='my-0.5 h-3 w-1/2 rounded-full' />
        </div>
      </div>
      <Spacer y={6} />
      <div className='space-y-4'>
        <div className='flex justify-between gap-4'>
          <div className='w-full'>
            <Skeleton className='absolute my-1 h-4 w-20 -translate-y-8 rounded-large' />
            <Skeleton className='h-10 w-full rounded-large' />
          </div>
          <Skeleton className='h-10 w-28 rounded-large' />
        </div>
        <Card className='min-h-[52px]' />
      </div>
    </div>
  );
}

export { FormSkeleton };
