'use client';

import { Tab, Tabs } from '@nextui-org/react';

import { ReviewListElement } from '../reviews/ReviewListElement';

import { type Destination, type Review } from '@/lib/db';

import { FavoriteListElement } from '@/components/profile/FavoriteListElement';
import { NoContent } from '@/components/profile/NoContent';

type ProfileTabsProps = {
  reviews: (Review & { name: string; images: string[]; id: number })[];
  favorites: Destination[];
};

function ProfileTabs({ reviews, favorites }: ProfileTabsProps) {
  const noFavorites = favorites.length === 0;
  const noReviews = reviews.length === 0;
  return (
    <div className='flex w-full flex-col'>
      <Tabs aria-label='Options'>
        <Tab key='review' title='Vurderinger'>
          {noReviews ? (
            <NoContent message='vurderinger' />
          ) : (
            reviews.map((reviews, index) => (
              <ReviewListElement key={index} review={reviews} />
            ))
          )}
        </Tab>
        <Tab key='favorites' title='Favoritter'>
          {noFavorites ? (
            <NoContent message='favoritt destinasjoner.' />
          ) : (
            favorites.map((destination, index) => (
              <FavoriteListElement key={index} destination={destination} />
            ))
          )}
        </Tab>
      </Tabs>
    </div>
  );
}
export { ProfileTabs };
