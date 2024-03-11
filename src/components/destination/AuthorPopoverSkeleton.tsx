import { Skeleton } from '@nextui-org/react';

function AuthorPopoverSkeleton({ className }: { className?: string }) {
  return (
    <div className={className}>
      <div className='inline-flex items-center justify-center gap-2 rounded-small'>
        <Skeleton className='size-14 rounded-full' />
        <div className='inline-flex flex-col items-start'>
          <Skeleton className='my-1 h-5 w-48 rounded-lg' />
          <Skeleton className='my-[3px] h-[14px] w-56 rounded-full text-sm' />
        </div>
      </div>
    </div>
  );
}

export { AuthorPopoverSkeleton };
