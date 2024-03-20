import { getTranslations } from 'next-intl/server';

import { type Destination, type Review, type User, sql } from '@/lib/db';

import { ReviewModal } from '@/components/reviews/ReviewModal';
import { Reviews } from '@/components/reviews/Reviews';

type ReviewSectionProps = {
  user: User | undefined;
  destination: Destination;
};

async function ReviewSection({ user, destination }: ReviewSectionProps) {
  const t = await getTranslations('reviews');

  if (!user) {
    return (
      <section>
        <span className='prose dark:prose-invert'>
          <h1 className='mb-2'>{t('title')}</h1>
        </span>
        <Reviews destination={destination} />
      </section>
    );
  }

  const [review]: Review[] = await sql`
        SELECT *
        FROM reviews
        WHERE destination_id = ${destination.id} AND user_id = ${user.id}
    `;

  return (
    <section>
      <div className='flex flex-row justify-between'>
        <span className='prose dark:prose-invert'>
          <h1 className='mb-2'>{t('title')}</h1>
        </span>
        <ReviewModal
          className='mb-6'
          review={review}
          updateReview={async (formData: FormData) => {
            'use server';
            console.log(formData);
          }}
          t={{
            editReview: t('editReview'),
            writeReview: t('writeReview'),
            cancel: t('cancel'),
            update: t('update'),
            create: t('create'),
            commentTooLong: t('commentTooLong'),
            writeComment: t('writeComment'),
            ratingInvalid: t('ratingInvalid'),
          }}
        />
      </div>
      <Reviews destination={destination} />
    </section>
  );
}

export { ReviewSection };
