import { Card, CardBody, Image, Link } from '@nextui-org/react';

import type { Destination } from '@/lib/db';

function FavoriteListElement({
  destination,
  key,
}: {
  destination: Destination;
  key: number;
}) {
  return (
    <Card
      id={String(key)}
      as={Link}
      href={`/${destination.id}`}
      className='m-1 w-full'
    >
      <CardBody>
        <div className='flex w-full flex-row items-center justify-center'>
          <div className='w-3/5'>
            <p className='text-2xl'>{destination.name}</p>
            {/* <p>{destination.content}</p> */}
          </div>
          <div>
            <Image
              alt='Destination image'
              height={150}
              radius='sm'
              src={destination.images[0]}
              width={150}
              className='flex'
            />
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

export { FavoriteListElement };
