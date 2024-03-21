import { getTranslations } from 'next-intl/server';

import { type Destination, type Review, type User } from '@/lib/db';
import { sql } from '@/lib/db';

import { ReviewCard } from '@/components/reviews/ReviewCard';

async function Reviews({ destination }: { destination: Destination }) {
  const t = await getTranslations('reviews');
  const reviews: Review[] = await sql`
    SELECT *
    FROM reviews
    WHERE destination_id = ${destination.id}
    ORDER BY created_at DESC;
  `;

  if (reviews.length === 0) {
    return <span className='italic text-default-500'>{t('noReviews')}</span>;
  }

  const authorIds = reviews.map((review) => review.userId);

  const authors: (User & { contributions: number })[] = await sql`
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
    WHERE users.id = ANY(${sql.array(authorIds)}::integer[]);
  `;

  return (
    <ul className='flex flex-col gap-2'>
      {reviews.map((review) => {
        const author = authors.find((author) => author.id === review.userId);

        if (!author) {
          throw new Error('Author not found');
        }

        return (
          <li key={`${review.userId}-${review.destinationId}`}>
            <ReviewCard
              review={review}
              author={author}
              t={{
                contributions: t('contributions'),
                modified: t('modified'),
              }}
            />
          </li>
        );
      })}
    </ul>
  );
}

export { Reviews };
