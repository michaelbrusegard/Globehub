import { Avatar, Card, CardBody } from '@nextui-org/react';

import { type Review, type User, sql } from '@/lib/db';

type ReviewListElementProps = {
  review: Review;
};

async function ReviewListElement({ review }: ReviewListElementProps) {
  const [user]: User[] = await sql`
    SELECT *
    FROM users
    WHERE id = ${review.userId};
  `;

  return (
    <Card className='m-1 w-full'>
      <CardBody className='flex flex-row justify-between'>
        <div className='flex w-1/4 align-middle'>
          <Avatar src={user?.image} alt={user?.name} className='h-4/5 w-4/5' />
        </div>
        <div className='flex w-3/4 flex-col'>
          <h3>{user?.name}</h3>
          <h4>Rating: {review.rating.valueOf() / 2}</h4>
          <p>{review.comment}</p>
          <p>Last modified: {review.modifiedAt?.toLocaleString()}</p>
        </div>
      </CardBody>
    </Card>
  );
}

export { ReviewListElement };
