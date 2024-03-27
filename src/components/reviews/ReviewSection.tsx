import { getLocale, getTranslations } from 'next-intl/server';
import { revalidatePath } from 'next/cache';

import { type Destination, type Review, type User, sql } from '@/lib/db';
import {
  DeleteObjectCommand,
  PutObjectCommand,
  endpoint,
  reviewsBucket,
  s3,
} from '@/lib/s3';
import { validateReview } from '@/lib/validation';

import { ReviewModal } from '@/components/reviews/ReviewModal';
import { Reviews } from '@/components/reviews/Reviews';

type ReviewSectionProps = {
  user: User | undefined;
  destination: Destination;
};

async function ReviewSection({ user, destination }: ReviewSectionProps) {
  const t = await getTranslations('reviews');
  const locale = await getLocale();

  if (!user || user.id === destination.userId) {
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
    <section id={t('title')}>
      <div className='flex flex-col justify-between sm:flex-row'>
        <span className='prose dark:prose-invert'>
          <h1 className='mb-2'>{t('title')}</h1>
        </span>
        <ReviewModal
          className='mb-6'
          review={review}
          updateReview={async (formData: FormData) => {
            'use server';

            if (!user) {
              throw new Error('User not found');
            }

            if (user.id === destination.userId) {
              throw new Error('User is the destination owner');
            }

            type FormDataEntriesProps = {
              imageUrl: string;
              imageFile?: File;
              rating: number;
              comment: string;
            };

            const formDataEntries: Partial<FormDataEntriesProps> =
              Object.fromEntries(formData);

            if (typeof formDataEntries.rating === 'string') {
              formDataEntries.rating = parseInt(formDataEntries.rating);
            }

            const oldImageUrl = review?.image;

            const parsed = validateReview({
              imageUrl: oldImageUrl,
            }).safeParse(formDataEntries);

            if (!parsed.success) {
              return;
            }

            const imageFile = formDataEntries.imageFile;
            let newImageUrl = parsed.data.imageUrl;

            if (
              newImageUrl !== oldImageUrl &&
              oldImageUrl?.startsWith(endpoint)
            ) {
              const params = {
                Bucket: reviewsBucket,
                Key: oldImageUrl.replace(
                  endpoint + '/' + reviewsBucket + '/',
                  '',
                ),
              };

              const deleteCommand = new DeleteObjectCommand(params);

              await s3.send(deleteCommand);
            }

            if (imageFile) {
              const fileName = `${Date.now()}-${user.id}`;
              const arrayBuffer = await imageFile.arrayBuffer();
              const buffer = Buffer.from(arrayBuffer);

              const params = {
                Bucket: reviewsBucket,
                Key: `${destination.id}/${fileName}`,
                Body: buffer,
              };

              const command = new PutObjectCommand(params);

              await s3.send(command);

              newImageUrl = `${endpoint}/${reviewsBucket}/${params.Key}`;
            }

            if (!review) {
              await sql`
                INSERT INTO reviews (destination_id, user_id, rating, comment, image)
                VALUES (${destination.id}, ${user.id}, ${parsed.data.rating}, ${parsed.data.comment}, ${newImageUrl ?? null})
              `;
            } else {
              await sql`
                UPDATE reviews
                SET rating = ${parsed.data.rating}, comment = ${parsed.data.comment}, image = ${newImageUrl ?? null}
                WHERE destination_id = ${destination.id} AND user_id = ${user.id}
              `;
            }

            revalidatePath(`/${locale}/${destination.id}`);
          }}
          deleteReview={async () => {
            'use server';

            if (!user) {
              throw new Error('User not found');
            }

            if (user.id === destination.userId) {
              throw new Error('User is the destination owner');
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
