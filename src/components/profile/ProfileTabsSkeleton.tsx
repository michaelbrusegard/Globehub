'use client';

import { Tab, Tabs } from '@nextui-org/react';

type ProfileTabsSkeletonProps = {
  t: {
    destinations: string;
    reviews: string;
    favorites: string;
  };
};

function ProfileTabsSkeleton({ t }: ProfileTabsSkeletonProps) {
  return (
    <div className='mx-auto max-w-2xl'>
      <Tabs
        className='flex w-full flex-col'
        variant='bordered'
        disabledKeys={['reviews', 'favorites', 'destinations']}
        aria-label='Options'
      >
        <Tab key='destinations' title={t.destinations} />
        <Tab key='reviews' title={t.reviews} />
        <Tab key='favorites' title={t.favorites} />
      </Tabs>
    </div>
  );
}

export { ProfileTabsSkeleton };
