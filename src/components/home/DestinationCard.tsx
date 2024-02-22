import LocationOn from '@material-symbols/svg-400/outlined/location_on.svg';
import { Card, CardBody, CardHeader, Image, Link } from '@nextui-org/react';
import NextImage from 'next/image';

import type { Destination } from '@/lib/db';

function DestinationCard({ destination }: { destination: Destination }) {
  const [longitude, latitude] = destination.location
    .replace('(', '')
    .replace(')', '')
    .split(',');

  const formattedLongitude = Number(longitude).toFixed(2) + '°';
  const formattedLatitude = Number(latitude).toFixed(2) + '°';
  return (
    <Card
      className='group h-[300px] w-full py-4'
      isPressable
      isHoverable
      as={Link}
      href={'/' + destination.id}
    >
      <CardHeader className='flex-col items-start px-4 pb-0 pt-2'>
        <h4 className='text-large font-bold'>{destination.name}</h4>
        <small className='flex items-center gap-0.5 text-default-500'>
          <LocationOn
            className='inline size-5 fill-default-500'
            aria-disabled='true'
          />
          <span>
            {formattedLongitude}, {formattedLatitude}
          </span>
        </small>
      </CardHeader>
      <CardBody className='overflow-hidden py-2'>
        <div className='relative flex h-full w-full overflow-hidden rounded-xl bg-default-100'>
          <Image
            className='object-cover object-center transition-transform duration-150 group-hover:scale-125'
            as={NextImage}
            alt={destination.name}
            src={destination.images![0]}
            fill
            priority
            removeWrapper
          />
        </div>
      </CardBody>
    </Card>
  );
}

export { DestinationCard };
