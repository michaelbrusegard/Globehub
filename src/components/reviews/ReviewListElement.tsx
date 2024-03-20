import { Card, CardBody, Image, Link } from '@nextui-org/react';

import { type Review } from '@/lib/db';

type ReviewProps = {
  review: Review & { name: string; images: string[]; id: number };
  key: number;
};

function ReviewListElement({ review, key }: ReviewProps) {
  return (
    <Card
      id={String(key)}
      as={Link}
      href={`/${review.id}`}
      className='m-1 w-full'
    >
      <CardBody>
        <div className='flex w-full flex-row items-center justify-center space-x-2'>
          <div className='w-3/5'>
            <p className='text-2xl'>{review.name}</p>
            <p>{'Rating: ' + review.rating / 2 + '/5'}</p>
            <p className='mt-1 text-xs leading-5'>{review.comment}</p>
          </div>
          <div>
            <Image
              alt='Destination image'
              height={150}
              radius='sm'
              src={review.images[0]}
              width={150}
              className='flex'
            />
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

export { ReviewListElement };
