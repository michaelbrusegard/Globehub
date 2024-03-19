import { revalidatePath } from 'next/cache';

import { type User } from '@/lib/db';
import { type Destination, type Review } from '@/lib/db';
import { sql } from '@/lib/db';
import { validateReview } from '@/lib/validation';

import { ReviewAdd } from '@/components/reviews/ReviewAdd';
import { ReviewListElement } from '@/components/reviews/ReviewListElement';

type ReviewsFieldProps = {
  className?: string;
  user: User | undefined;
  destination: Destination;
};

async function ReviewsField({
  className,
  user,
  destination,
}: ReviewsFieldProps) {
  const reviews: Review[] = await sql`
    SELECT reviews.*
    FROM reviews
    WHERE destination_id = ${destination.id};
  `;

  const reviewExists = async () => {
    if (!user) return false;

    const existingReview = await sql`
      SELECT *
      FROM reviews
      WHERE user_id = ${user.id} AND destination_id = ${destination.id};
    `;

    return existingReview.length > 0;
  };

  return (
    <div>
      {user && (
        <ReviewAdd
          addReview={async (FormData: FormData) => {
            'use server';

            if (!user) {
              throw new Error('You must be signed in to perform this action');
            }

            const reviewSchema = validateReview();
            const parsed = reviewSchema.safeParse({
              ...Object.fromEntries(FormData),
              rating: Number(FormData.get('rating')),
            });

            if (!parsed.success) {
              console.error('Error:', parsed.error);
              return;
            }

            console.log('FormData:', FormData);

            await sql`
              INSERT INTO reviews (destination_id, user_id, rating, comment)
              VALUES (${destination.id}, ${user.id}, ${parsed.data.rating}, ${parsed.data.comment})
            `;

            revalidatePath(`/${destination.id}`);
          }}
          reviewExists={await reviewExists()}
        />
      )}
      {reviews.map((review, index) => (
        <ReviewListElement key={index} review={review} />
      ))}
    </div>
  );
}

export { ReviewsField };
