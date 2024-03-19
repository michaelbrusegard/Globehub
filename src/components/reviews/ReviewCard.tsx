import { Card, CardBody, CardFooter, CardHeader } from '@nextui-org/react';
import { getTranslations } from 'next-intl/server';

import { type Review, type User, sql } from '@/lib/db';

import { Time } from '@/components/reusables/Time';
import { AuthorPopover } from '@/components/reviews/AuthorPopover';

async function ReviewCard({ review }: { review: Review }) {
  const t = await getTranslations('reviews');
  const [author]: (User & { contributions: number })[] = await sql`
    SELECT users.*, COALESCE(reviews.review_count, 0) + COALESCE(destinations.destination_count, 0) as contributions
    FROM users
    LEFT JOIN (
      SELECT user_id, COUNT(*) as review_count
      FROM reviews
      GROUP BY user_id
    ) reviews ON users.id = reviews.user_id
    LEFT JOIN (
      SELECT user_id, COUNT(*) as destination_count
      FROM destinations
      GROUP BY user_id
    ) destinations ON users.id = destinations.user_id
    WHERE users.id = ${review.userId};
  `;

  if (!author) {
    throw new Error('Author not found');
  }

  return (
    <Card>
      <CardHeader className='flex flex-col items-start justify-between gap-4 sm:flex-row'>
        <AuthorPopover author={author} />
        <Time
          className='flex flex-col text-xs'
          createdAt={review.createdAt}
          modifiedAt={review.modifiedAt}
        />
      </CardHeader>
      <CardBody></CardBody>
      <CardFooter></CardFooter>
    </Card>
  );
}

export { ReviewCard };
