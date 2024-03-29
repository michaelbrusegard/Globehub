'use client';

import { Tab, Tabs } from '@nextui-org/react';

import { OrderIcon } from '@/components/home/OrderIcon';

type DestinationsTabsSkeletonProps = {
  orderCriteria: string[];
};

function DestinationsTabsSkeleton({
  orderCriteria,
}: DestinationsTabsSkeletonProps) {
  return (
    <Tabs className='mx-8 mb-2 self-auto sm:self-start' size='sm' isDisabled>
      {orderCriteria.map((key) => (
        <Tab
          key={key}
          title={
            <OrderIcon
              className='size-5 fill-default-500 group-data-[selected=true]:fill-default-foreground'
              icon={key}
              aria-hidden='true'
            />
          }
        />
      ))}
    </Tabs>
  );
}

export { DestinationsTabsSkeleton };
