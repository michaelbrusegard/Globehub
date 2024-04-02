import { Avatar } from '@nextui-org/react';
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import { revalidatePath } from 'next/cache';
import NextImage from 'next/image';

import { auth } from '@/lib/auth';
import { type Destination, type Review, sql } from '@/lib/db';
import { redirect } from '@/lib/navigation';
import {
  DeleteObjectCommand,
  destinationsBucket,
  endpoint,
  reviewsBucket,
  s3,
} from '@/lib/s3';
import { validateProfile } from '@/lib/validation';

import { EditProfileModal } from '@/components/profile/EditProfileModal';
import { ProfileTabs } from '@/components/profile/ProfileTabs';
import { DeleteModal } from '@/components/settings/DeleteModal';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale, namespace: 'meta' });

  return {
    title: t('myProfile'),
  };
}

export default async function Profile({
  params: { locale },
}: {
  params: { locale: string };
}) {
  unstable_setRequestLocale(locale);
  const t = await getTranslations('profile');
  const session = await auth();
  const user = session?.user;

  if (!user) {
    redirect('/signin');
    return null;
  }

  const favorites: (Destination & {
    averageRating: number;
    favoriteCount: number;
  })[] = await sql`
    SELECT destinations.*, COALESCE(AVG(reviews.rating), 0) as average_rating, COALESCE(COUNT(user_favorites.destination_id), 0) as favorite_count
    FROM destinations
    INNER JOIN user_favorites ON destinations.id = user_favorites.destination_id
    LEFT JOIN reviews ON destinations.id = reviews.destination_id
    WHERE user_favorites.user_id = ${user.id}
    GROUP BY destinations.id;
  `;

  const reviews: (Review & {
    name: string;
  })[] = await sql`
    SELECT reviews.*, destinations.name
    FROM reviews
    JOIN destinations ON reviews.destination_id = destinations.id
    WHERE reviews.user_id = ${user.id}
  `;

  const [userContributions]: { contributions: number }[] = await sql`
    SELECT COALESCE(reviews.review_count, 0) + COALESCE(destinations.destination_count, 0) as contributions
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
    WHERE users.id = ${user.id};
  `;

  const author = {
    ...user,
    contributions: userContributions?.contributions ?? 0,
  };

  const destinations: (Destination & {
    averageRating: number;
    favoriteCount: number;
  })[] = await sql`
    SELECT destinations.*, COALESCE(AVG(reviews.rating), 0) as average_rating, COALESCE(COUNT(user_favorites.destination_id), 0) as favorite_count
    FROM destinations
    LEFT JOIN reviews ON destinations.id = reviews.destination_id
    LEFT JOIN user_favorites ON destinations.id = user_favorites.destination_id
    WHERE destinations.user_id = ${user.id}
    GROUP BY destinations.id;
  `;

  return (
    <>
      <h1 className='my-4 bg-gradient-to-br from-primary to-secondary bg-clip-text font-arimo text-4xl font-bold tracking-tight text-transparent lg:text-5xl'>
        {t('myProfile')}
      </h1>
      <div className='mb-10 flex flex-col gap-0 sm:flex-row sm:gap-3'>
        <Avatar
          className='mx-auto h-40 w-40 shrink-0 sm:mx-0'
          classNames={{
            name: 'font-arimo font-semibold',
          }}
          ImgComponent={NextImage}
          imgProps={{
            width: 160,
            height: 160,
            fetchPriority: 'high',
            loading: 'eager',
          }}
          src={user.image}
          isBordered
        />
        <div className='mt-4 flex-grow'>
          <div className='flex flex-row items-center justify-between'>
            <h2 className='truncate text-2xl font-semibold'>{user.name}</h2>
            <EditProfileModal
              updateProfile={async (formData: FormData) => {
                'use server';

                if (!user) {
                  throw new Error(
                    'You must be signed in to perform this action',
                  );
                }

                const parsed = validateProfile().safeParse(
                  Object.fromEntries(formData) as { bio: string },
                );

                if (!parsed.success) {
                  return;
                }

                await sql`
                    UPDATE users
                    SET bio = ${parsed.data.bio}
                    WHERE id = ${user.id}
                  `;

                revalidatePath(`/${locale}/profile`);
              }}
              profile={{
                bio: user.bio,
              }}
              t={{
                edit: t('edit'),
                editBio: t('editBio'),
                cancel: t('cancel'),
                update: t('update'),
                writeBio: t('writeBio'),
                bioTooLong: t('bioTooLong'),
              }}
            />
          </div>
          {user.bio ? (
            <p className='mx-2 line-clamp-6 overflow-clip overflow-ellipsis sm:line-clamp-4'>
              {user.bio}
            </p>
          ) : (
            <p className='mx-2 italic text-default-400'>{t('emptyBio')}</p>
          )}
        </div>
      </div>
      <ProfileTabs
        destinations={destinations}
        reviews={reviews}
        user={author}
        favorites={favorites}
        t={{
          reviews: t('reviews'),
          favorites: t('favorites'),
          noContent: t('noContent'),
          destinations: t('destinations'),
          goToDestination: t('goToDestination'),
          contributions: t('contributions'),
          views: t('views'),
          modified: t('modified'),
          rating: t('rating'),
          noReviews: t('noReviews'),
        }}
      />
      <div className='flex w-full justify-center'>
        <DeleteModal
          className='my-16'
          action={async () => {
            'use server';

            if (!user) {
              throw new Error('You must be signed in to perform this action');
            }

            const reviewImageUrls: string[] = [];
            const destinationImageUrls: string[] = [];

            await sql.begin(async (sql): Promise<void> => {
              const userReviews: { image: string }[] = await sql`
                SELECT image FROM reviews
                WHERE user_id = ${user.id}
              `;
              reviewImageUrls.push(
                ...userReviews.map((review) => review.image),
              );

              const userDestinations: { id: number; images: string[] }[] =
                await sql`
                SELECT id, images FROM destinations
                WHERE user_id = ${user.id}
              `;
              destinationImageUrls.push(
                ...userDestinations.flatMap(
                  (destination) => destination.images,
                ),
              );

              const destinationIds = userDestinations.map(
                (destination) => destination.id,
              );

              const destinationReviews: { image: string }[] = await sql`
                SELECT image FROM reviews
                WHERE destination_id = ANY(${sql.array(destinationIds)}::integer[])
              `;

              reviewImageUrls.push(
                ...destinationReviews
                  .filter((review) => review.image)
                  .map((review) => review.image),
              );

              await sql`
                DELETE FROM reviews
                WHERE destination_id = ANY(${sql.array(destinationIds)}::integer[])
              `;

              await sql`
                DELETE FROM user_favorites
                WHERE destination_id = ANY(${sql.array(destinationIds)}::integer[])
              `;

              await sql`
                DELETE FROM weather_caches
                WHERE destination_id = ANY(${sql.array(destinationIds)}::integer[])
              `;

              const destinationKeywordIds: { keywordId: number }[] = await sql`
                SELECT keyword_id FROM destination_keywords
                WHERE destination_id = ANY(${sql.array(destinationIds)}::integer[])
              `;

              await sql`
                DELETE FROM destination_keywords
                WHERE destination_id = ANY(${sql.array(destinationIds)}::integer[])
              `;

              const keywordIds = destinationKeywordIds.map(
                (keyword) => keyword.keywordId,
              );

              for (const keywordId of keywordIds) {
                const [result]: { count: number }[] = await sql`
                  SELECT COUNT(*) FROM destination_keywords
                  WHERE keyword_id = ${keywordId}
                `;

                if (result && result.count === 0) {
                  await sql`
                    DELETE FROM keywords
                    WHERE id = ${keywordId}
                  `;
                }
              }

              await sql`
                DELETE FROM user_favorites
                WHERE user_id = ${user.id}
              `;

              await sql`
                DELETE FROM reviews
                WHERE user_id = ${user.id}
              `;

              await sql`
                DELETE FROM destinations
                WHERE user_id = ${user.id}
              `;

              await sql`
                DELETE FROM sessions
                WHERE "userId" = ${user.id}
              `;

              await sql`
                DELETE FROM accounts
                WHERE "userId" = ${user.id}
              `;

              await sql`
                DELETE FROM users
                WHERE id = ${user.id}
              `;
            });

            for (const imageUrl of destinationImageUrls) {
              if (!imageUrl.startsWith(endpoint)) {
                continue;
              }

              const params = {
                Bucket: destinationsBucket,
                Key: imageUrl.replace(
                  endpoint + '/' + destinationsBucket + '/',
                  '',
                ),
              };

              const deleteCommand = new DeleteObjectCommand(params);

              await s3.send(deleteCommand);
            }

            for (const imageUrl of reviewImageUrls) {
              if (!imageUrl.startsWith(endpoint)) {
                continue;
              }

              const params = {
                Bucket: reviewsBucket,
                Key: imageUrl.replace(endpoint + '/' + reviewsBucket + '/', ''),
              };

              const deleteCommand = new DeleteObjectCommand(params);

              await s3.send(deleteCommand);
            }

            redirect('/signin');
          }}
          t={{
            delete: t('delete'),
            cancel: t('cancel'),
            description: t('deleteConfirmation', {
              name: user.name,
            }),
            buttonText: t('deleteUser'),
          }}
        />
      </div>
    </>
  );
}
