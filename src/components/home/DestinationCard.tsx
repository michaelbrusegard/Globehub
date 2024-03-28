import HotelClass from '@material-symbols/svg-400/outlined/hotel_class.svg';
import Schedule from '@material-symbols/svg-400/outlined/schedule.svg';
import Visibility from '@material-symbols/svg-400/outlined/visibility.svg';
import { Card, CardBody, CardHeader, Image, Link } from '@nextui-org/react';
import { useFormatter, useTranslations } from 'next-intl';
import NextImage from 'next/image';

import type { Destination } from '@/lib/db';
import { formatRating } from '@/lib/utils';

type DestinationCardProps = {
  destination: Destination & { averageRating: number };
  order: string;
};

function Subtitle({ destination, order }: DestinationCardProps) {
  const t = useTranslations('home');
  const format = useFormatter();
  const rating =
    destination.averageRating > 0
      ? formatRating(destination.averageRating)
      : null;

  switch (order) {
    case 'newest':
      return (
        <>
          <Schedule
            className='size-4 self-center fill-default-500'
            aria-disabled='true'
          />
          <time
            className='self-end'
            dateTime={destination.createdAt.toISOString()}
          >
            {format.dateTime(destination.createdAt, {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </time>
        </>
      );
    case 'views':
      return (
        <>
          <Visibility
            className='size-4 self-center fill-default-500'
            aria-disabled='true'
          />
          {destination.views > 0 ? (
            <span
              className='self-end'
              aria-label={t('views') + ': ' + destination.views}
            >
              {destination.views}
            </span>
          ) : (
            <span className='self-end italic'>{t('noViews')}</span>
          )}
        </>
      );
    default:
      return (
        <>
          <HotelClass
            className='size-4 self-center fill-default-500'
            aria-disabled='true'
          />
          {rating ? (
            <span className='self-end' aria-label={t('rating') + ': ' + rating}>
              {rating}
            </span>
          ) : (
            <span className='self-end italic'>{t('noReviews')}</span>
          )}
        </>
      );
  }
}

function DestinationCard({ destination, order }: DestinationCardProps) {
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
          <Subtitle destination={destination} order={order} />
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
