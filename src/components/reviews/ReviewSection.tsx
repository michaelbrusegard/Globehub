import { getLocale, getTranslations } from 'next-intl/server';
import { revalidatePath } from 'next/cache';

import { type Destination, type Review, type User, sql } from '@/lib/db';
import { DeleteObjectCommand, endpoint, reviewsBucket, s3 } from '@/lib/s3';

import { ReviewModal } from '@/components/reviews/ReviewModal';
import { Reviews } from '@/components/reviews/Reviews';

type ReviewSectionProps = {
  user: User | undefined;
  destination: Destination;
};

async function ReviewSection({ user, destination }: ReviewSectionProps) {
  const t = await getTranslations('reviews');
  const locale = await getLocale();

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
          deleteReview={async () => {
            'use server';

            if (!user) {
              throw new Error('User not found');
            }

            if (!review) {
              throw new Error('Review not found');
            }

            const reviewImage = review?.image;

            await sql`
              DELETE FROM reviews
              WHERE destination_id = ${destination.id} AND user_id = ${user.id}
            `;

            if (reviewImage && reviewImage.startsWith(endpoint)) {
              const params = {
                Bucket: reviewsBucket,
                Key: reviewImage.replace(
                  endpoint + '/' + reviewsBucket + '/',
                  '',
                ),
              };

              const deleteCommand = new DeleteObjectCommand(params);

              await s3.send(deleteCommand);
            }

            revalidatePath(`/${locale}/${destination.id}`);
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
            ratingRequired: t('ratingRequired'),
            delete: t('delete'),
            deleteConfirmation: t('deleteConfirmation'),
            deleteReview: t('deleteReview'),
            imageNameTooLong: t('imageNameTooLong'),
            imageTypeInvalid: t('imageTypeInvalid'),
            imageSizeTooLarge: t('imageSizeTooLarge'),
            removeImage: t('removeImage'),
            PngJpg1MbMax: t('PngJpg1MbMax'),
            uploadAFile: t('uploadAFile'),
            orDragAndDrop: t('orDragAndDrop'),
          }}
        />
      </div>
      <Reviews destination={destination} />
    </section>
  );
}

export { ReviewSection };
