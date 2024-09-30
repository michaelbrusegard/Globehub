import { getLocale, getTranslations } from 'next-intl/server';
import { revalidatePath } from 'next/cache';

import { type Destination, type Review, type User, sql } from '@/lib/db';
import {
  DeleteObjectCommand,
  PutObjectCommand,
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
  const pageSize = 5;

  let review: Review | undefined = undefined;

  if (user && user.id !== destination.userId) {
    [review] = await sql`
      SELECT *
      FROM reviews
      WHERE destination_id = ${destination.id} AND user_id = ${user.id}
    `;
  }

  const [totalReviews]: { count: number }[] = await sql`
    SELECT COUNT(*)
    FROM reviews
    WHERE destination_id = ${destination.id};
  `;

  const initialReviews: Review[] = totalReviews?.count
    ? await sql`
    SELECT *
    FROM reviews
    WHERE destination_id = ${destination.id}
    ORDER BY created_at DESC
    LIMIT ${pageSize} OFFSET 0;
  `
    : [];

  const authorIds = initialReviews.map((review) => review.userId);

  const initialAuthors: (User & { contributions: number })[] =
    totalReviews?.count
      ? await sql`
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
  `
      : [];

  return (
    <section id={t('title')}>
      <div className='flex flex-col justify-between sm:flex-row'>
        <span className='prose dark:prose-invert'>
          <h1 className='mb-2'>{t('title')}</h1>
        </span>
        {user && user.id !== destination.userId && (
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
                oldImageUrl?.startsWith(reviewsBucket)
              ) {
                const params = {
                  Bucket: reviewsBucket,
                  Key: oldImageUrl.replace(reviewsBucket + '/', ''),
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

                newImageUrl = `${reviewsBucket}/${params.Key}`;
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

              if (reviewImage && reviewImage.startsWith(reviewsBucket)) {
                const params = {
                  Bucket: reviewsBucket,
                  Key: reviewImage.replace(reviewsBucket + '/', ''),
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
              uploadedImage: t('uploadedImage'),
            }}
          />
        )}
      </div>
      <Reviews
        totalReviews={totalReviews?.count ?? 0}
        initialReviews={initialReviews}
        initialAuthors={initialAuthors}
        getReviews={async (page: number) => {
          'use server';

          const reviews: Review[] = await sql`
            SELECT *
            FROM reviews
            WHERE destination_id = ${destination.id}
            ORDER BY created_at DESC
            LIMIT ${pageSize} OFFSET ${(page - 1) * pageSize};
          `;

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

          return { reviews, authors };
        }}
        t={{
          noReviews: t('noReviews'),
          contributions: t('contributions'),
          modified: t('modified'),
          memberSince: t('memberSince'),
          noBio: t('noBio'),
          loadMore: t('loadMore'),
          loadingMoreReviews: t('loadingMoreReviews'),
          reviewImage: t('reviewImage'),
        }}
      />
    </section>
  );
}

export { ReviewSection };
