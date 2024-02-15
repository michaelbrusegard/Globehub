import { Link } from '@nextui-org/react';
import { Divider } from '@nextui-org/react';
import React from 'react';

import { type Destination } from '@/lib/db';

import { DestinationPhotos } from '@/components/layout/DestinationPhotos';

interface Props {
  destination: Destination;
}

export function card({ destination }: Props) {
  return (
    <Link href='/destination'>
      <div className='max-w-1/3 overflow-hidden rounded-xl bg-gray-200 shadow-lg'>
        <div className='p-6'>
          <DestinationPhotos images={destination.images!} />
          <Divider className='my-2' />
          <div className='mb-2 text-xl font-bold'>{destination.name}</div>
          <p className='text-base text-gray-700'>{destination.description}</p>
        </div>
      </div>
    </Link>
  );
}
