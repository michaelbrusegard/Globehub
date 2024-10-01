import { env } from '@/env';
import Favorite from '@material-symbols/svg-400/outlined/favorite.svg';
import HotelClass from '@material-symbols/svg-400/outlined/hotel_class.svg';
import Visibility from '@material-symbols/svg-400/outlined/visibility.svg';
import { Card, CardBody, CardHeader, Image, Link } from '@nextui-org/react';
import { useFormatter } from 'next-intl';
import NextImage from 'next/image';

import { type Destination } from '@/lib/db';
import { formatRating } from '@/lib/utils';

import { Time } from '@/components/reusables/Time';

type DestinationTabCardProps = {
  destination: Destination & { averageRating: number; favoriteCount: number };
  t: {
    goToDestination: string;
    views: string;
    modified: string;
    rating: string;
    noReviews: string;
    favorites: string;
    imageOf: string;
  };
};

function DestinationTabCard({ destination, t }: DestinationTabCardProps) {
  const format = useFormatter();
  const rating =
    destination.averageRating > 0
      ? formatRating(destination.averageRating)
      : null;

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
          alt={t.imageOf + ' ' + destination.name}
          src={env.NEXT_PUBLIC_STORAGE_URL + '/' + destination.images[0]}
          width={199}
          height={112}
        />
        <div className='space-y-2'>
          <p className='fill-default-500 text-default-500'>
            <div className='flex gap-1'>
              <HotelClass className='size-5 self-start' aria-disabled='true' />
              {rating ? (
                <span
                  className='self-end'
                  aria-label={t.rating + ': ' + rating}
                >
                  {rating}
                </span>
              ) : (
                <span className='self-end italic'>{t.noReviews}</span>
              )}
            </div>
            <div className='flex gap-1'>
              <Visibility className='size-5 self-center' aria-disabled='true' />
              <span
                className='self-end'
                aria-label={t.views + ': ' + format.number(destination.views)}
              >
                {format.number(destination.views)}
              </span>
            </div>
            <div className='flex gap-1'>
              <Favorite className='size-5 self-center' aria-disabled='true' />
              <span
                className='self-end'
                aria-label={
                  t.favorites + ': ' + format.number(destination.favoriteCount)
                }
              >
                {format.number(destination.favoriteCount)}
              </span>
            </div>
          </p>
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
