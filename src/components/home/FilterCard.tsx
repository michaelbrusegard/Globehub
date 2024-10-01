import { env } from '@/env';
import EditAttributes from '@material-symbols/svg-400/outlined/edit_attributes.svg';
import { Card, CardBody, CardHeader, Image, Link } from '@nextui-org/react';
import { useTranslations } from 'next-intl';
import NextImage from 'next/image';

import type { Destination } from '@/lib/db';

type FilterCardProps = {
  destination: Destination & { keywords: string[] };
  worldRegions: Record<string, string>;
};

function FilterCard({ destination, worldRegions }: FilterCardProps) {
  const t = useTranslations('home');
  return (
    <Card
      className='group size-[300px] py-4'
      isPressable
      as={Link}
      href={'/' + destination.id}
    >
      <CardHeader className='flex-col items-start px-4 pb-0 pt-2'>
        <h4 className='text-large font-bold'>{destination.name}</h4>
        <small className='inline-flex text-default-500'>
          <span>
            <EditAttributes
              className='mr-1 inline size-4 fill-default-500'
              aria-disabled='true'
            />
            {worldRegions[destination.worldRegion] +
              ', ' +
              destination.keywords.join(', ')}
          </span>
        </small>
      </CardHeader>
      <CardBody className='overflow-hidden py-2'>
        <div className='relative flex h-full w-full overflow-hidden rounded-xl bg-default-100'>
          <Image
            className='object-cover object-center transition-transform duration-150 group-hover:scale-125'
            as={NextImage}
            alt={t('imageOf') + ' ' + destination.name}
            src={env.NEXT_PUBLIC_STORAGE_URL + '/' + destination.images[0]}
            sizes='(max-width: 768px) 100vw, 33vw'
            fill
            removeWrapper
          />
        </div>
      </CardBody>
    </Card>
  );
}

export { FilterCard };
