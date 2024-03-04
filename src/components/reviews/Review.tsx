import { Avatar } from '@nextui-org/react';
import NextImage from 'next/image';
import React from 'react';

type ReviewProps = {
  profilepic: string | undefined | null;
  review: { text: string; dest: string; stars: number; date: string };
  key: string;
};

function Review({ profilepic, review, key }: ReviewProps) {
  return (
    <li key={key} className='flex justify-between gap-x-6 py-5'>
      <div className='flex min-w-0 gap-x-4'>
        <Avatar
          className='mx-auto h-10 w-10 flex-shrink-0 sm:mx-0'
          classNames={{
            name: 'font-arimo font-semibold',
          }}
          ImgComponent={NextImage}
          imgProps={{
            width: 160,
            height: 160,
            fetchPriority: 'high',
            loading: 'eager',
          }}
          src={profilepic!}
          isBordered
        />
        <div className='min-w-0 flex-auto'>
          <p className='text-sm font-semibold leading-6'>
            {review.dest + '  ' + review.stars + '/5'}
          </p>
          <p className='mt-1 text-xs leading-5 text-gray-500'>{review.text}</p>
        </div>
      </div>
      <div className='hidden shrink-0 sm:flex sm:flex-col sm:items-end'>
        <p className='mt-1 text-xs leading-5 text-gray-500'>{review.date}</p>
      </div>
    </li>
  );
}

export { Review };
