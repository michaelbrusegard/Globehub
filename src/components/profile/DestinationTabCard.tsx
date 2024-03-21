import { Card, CardBody, CardHeader, Image, Link } from '@nextui-org/react';
import NextImage from 'next/image';

import { type Destination } from '@/lib/db';

import { Time } from '@/components/reusables/Time';

type DestinationTabCardProps = {
  destination: Destination;
  t: {
    goToDestination: string;
    views: string;
    modified: string;
  };
};

function DestinationTabCard({ destination, t }: DestinationTabCardProps) {
  return (
    <Card>
      <CardHeader className='flex items-center justify-between gap-1'>
        <h3 className='text-2xl font-bold leading-tight tracking-tighter md:text-3xl lg:text-4xl'>
          {destination.name}
        </h3>
        <Link href={`/${destination.id}`} underline='hover' showAnchorIcon>
          {t.goToDestination}
        </Link>
      </CardHeader>
      <CardBody className='flex flex-col gap-4 sm:flex-row'>
        <Image
          className='aspect-video h-28 object-cover object-center'
          as={NextImage}
          alt={destination.images[0]}
          src={destination.images[0]}
          width={199}
          height={112}
        />
        <div className='space-y-2'>
          <p>{t.views + ': ' + destination.views}</p>
          <Time
            className='text-xs'
            createdAt={destination.createdAt}
            modifiedAt={destination.modifiedAt}
            t={{
              modified: t.modified,
            }}
          />
        </div>
      </CardBody>
    </Card>
  );
}

export { DestinationTabCard };
