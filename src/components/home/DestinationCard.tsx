import HotelClass from '@material-symbols/svg-400/outlined/hotel_class.svg';
import { Card, CardBody, CardHeader, Image, Link } from '@nextui-org/react';
import { useTranslations } from 'next-intl';
import NextImage from 'next/image';

import type { Destination } from '@/lib/db';
import { formatRating } from '@/lib/utils';

function DestinationCard({
  destination,
}: {
  destination: Destination & { averageRating: number | null };
}) {
  const t = useTranslations('home');
  const rating =
    destination.averageRating !== 0
      ? formatRating(destination.averageRating!)
      : null;
  return (
    <Card
      className='group h-[300px] w-full py-4'
      isPressable
      as={Link}
      href={'/' + destination.id}
    >
      <CardHeader className='flex-col items-start px-4 pb-0 pt-2'>
        <h4 className='text-large font-bold'>{destination.name}</h4>
        <small className='flex gap-0.5 text-default-500'>
          <HotelClass
            className='size-4 self-center fill-default-500'
            aria-disabled='true'
          />

          {destination.averageRating !== 0 ? (
            <span className='self-end' aria-label={t('rating') + ': ' + rating}>
              {rating}
            </span>
          ) : (
            <span className='self-end italic'>{t('noReviews')}</span>
          )}
        </small>
      </CardHeader>
      <CardBody className='overflow-hidden py-2'>
        <div className='relative flex h-full w-full overflow-hidden rounded-xl bg-default-100'>
          <Image
            className='object-cover object-center transition-transform duration-150 group-hover:scale-125'
            as={NextImage}
            alt={destination.name}
            src={destination.images[0]}
            sizes='(max-width: 768px) 100vw, 33vw'
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
