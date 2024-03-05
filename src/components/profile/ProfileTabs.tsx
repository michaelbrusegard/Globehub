'use client';

import { Card, CardBody, Tab, Tabs } from '@nextui-org/react';
import { useTranslations } from 'next-intl';

import { type Destination, type Review } from '@/lib/db';

import { FavoriteListElement } from '@/components/profile/FavoriteListElement';

type ProfileTabsProps = {
  reviews: [Review];
  favorites: Destination[];
};

function ProfileTabs({
  // reviews,
  favorites,
}: ProfileTabsProps) {
  // const t = useTranslations('profile');
  // console.log(favorites);
  return (
    <div className='flex w-full flex-col'>
      <Tabs aria-label='Options'>
        <Tab key='review' title='Vurderinger'>
          <Card>
            <CardBody>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </CardBody>
          </Card>
        </Tab>
        <Tab key='favorites' title='Favoritter'>
          {favorites.map((destination, index) => (
            <FavoriteListElement key={index} destination={destination} />
          ))}
        </Tab>
      </Tabs>
    </div>
  );
}

export { ProfileTabs };
