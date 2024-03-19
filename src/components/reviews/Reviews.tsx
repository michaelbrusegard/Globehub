import { type User } from '@/lib/db';
import { type Destination, type Review } from '@/lib/db';
import { sql } from '@/lib/db';
import { validateReview } from '@/lib/validation';

import { ReviewCard } from '@/components/reviews/ReviewCard';

type ReviewsFieldProps = {
  user: User | undefined;
  destination: Destination;
};

async function Reviews({ user, destination }: ReviewsFieldProps) {
  const reviews: Review[] = await sql`
    SELECT *
    FROM reviews
    WHERE destination_id = ${destination.id}
    ORDER BY created_at DESC;
  `;

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
