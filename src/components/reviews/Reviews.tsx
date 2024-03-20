import { getTranslations } from 'next-intl/server';

import { type Destination, type Review } from '@/lib/db';
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
    <span className='italic text-default-500'>{t('noReviews')}</span>;
  }

  return (
    <ul className='flex flex-col gap-2'>
      {reviews.map((review) => (
        <li key={`${review.userId}-${review.destinationId}`}>
          <ReviewCard review={review} />
        </li>
      ))}
    </ul>
  );
}

export { Reviews };
