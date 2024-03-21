'use client';

import { Tab, Tabs } from '@nextui-org/react';

import { type Destination, type Review, type User } from '@/lib/db';

import { DestinationTabCard } from '@/components/profile/DestinationTabCard';
import { ReviewTabCard } from '@/components/profile/ReviewTabCard';

type ProfileTabsProps = {
  destinations: Destination[];
  reviews: (Review & { name: string })[];
  favorites: Destination[];
  user: User & { contributions: number };
  t: {
    reviews: string;
    favorites: string;
    noContent: string;
    destinations: string;
    contributions: string;
    goToDestination: string;
    views: string;
    modified: string;
  };
};

function ProfileTabs({
  destinations,
  reviews,
  favorites,
  user,
  t,
}: ProfileTabsProps) {
  const disabledKeys = [];

  if (reviews.length === 0) {
    disabledKeys.push('reviews');
  }
  if (favorites.length === 0) {
    disabledKeys.push('favorites');
  }
  if (destinations.length === 0) {
    disabledKeys.push('destinations');
  }

  return (
    <div className='mx-auto min-h-unit-7xl max-w-2xl'>
      <Tabs
        className='flex w-full flex-col'
        variant='bordered'
        disabledKeys={disabledKeys}
        aria-label='Options'
      >
        <Tab key='destinations' title={t.destinations}>
          <ul className='space-y-2'>
            {destinations.map((destination) => (
              <li key={destination.id}>
                <DestinationTabCard
                  destination={destination}
                  t={{
                    goToDestination: t.goToDestination,
                    views: t.views,
                    modified: t.modified,
                  }}
                />
              </li>
            ))}
          </ul>
        </Tab>
        <Tab key='reviews' title={t.reviews}>
          <ul className='space-y-2'>
            {reviews.map((review) => (
              <li key={`${review.userId}-${review.destinationId}`}>
                <ReviewTabCard
                  review={review}
                  author={user}
                  t={{
                    goToDestination: t.goToDestination,
                    contributions: t.contributions,
                    modified: t.modified,
                  }}
                />
              </li>
            ))}
          </ul>
        </Tab>
        <Tab key='favorites' title={t.favorites}>
          <ul className='space-y-2'>
            {favorites.map((favorite) => (
              <li key={favorite.id}>
                <DestinationTabCard
                  destination={favorite}
                  t={{
                    goToDestination: t.goToDestination,
                    views: t.views,
                    modified: t.modified,
                  }}
                />
              </li>
            ))}
          </ul>
        </Tab>
      </Tabs>
      {disabledKeys.length === 3 && (
        <p className='mt-4 text-center italic text-default-500'>
          {t.noContent}
        </p>
      )}
    </div>
  );
}
export { ProfileTabs };
