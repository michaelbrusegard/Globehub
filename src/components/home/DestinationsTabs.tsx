'use client';

import { Tab, Tabs } from '@nextui-org/react';
import { parseAsString, useQueryState } from 'nuqs';

import { OrderIcon } from '@/components/home/OrderIcon';

type DestinationsTabsProps = {
  orderCriteria: Record<string, string>;
  t: {
    orderDestinationsBy: string;
    order: string;
  };
};

function DestinationsTabs({ orderCriteria, t }: DestinationsTabsProps) {
  const [order, setOrder] = useQueryState(
    t.order,
    parseAsString
      .withDefault(Object.values(orderCriteria)[0]!)
      .withOptions({ shallow: false, clearOnDefault: true }),
  );

  return (
    <Tabs
      className='mx-8 mb-2 self-start'
      size='sm'
      selectedKey={orderCriteria[order]}
      onSelectionChange={(key) => {
        void setOrder(orderCriteria[key]!);
      }}
      aria-label={t.orderDestinationsBy}
    >
      {Object.entries(orderCriteria).map(([key, value]) => (
        <Tab
          key={key}
          title={
            <OrderIcon
              className='size-5 fill-default-500 group-data-[selected=true]:fill-default-foreground'
              icon={key}
              aria-hidden='true'
            />
          }
          aria-label={value}
        />
      ))}
    </Tabs>
  );
}

export { DestinationsTabs };
