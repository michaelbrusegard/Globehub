import { Chip } from '@nextui-org/react';
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import { revalidatePath } from 'next/cache';
import { notFound } from 'next/navigation';
import Markdown from 'react-markdown';

import { auth } from '@/lib/auth';
import { type Destination, type User, sql } from '@/lib/db';

import { AuthorPopover } from '@/components/destination/AuthorPopover';
import { AverageRating } from '@/components/destination/AverageRating';
import { Map } from '@/components/destination/DynamicMap';
import { ImageCarousel } from '@/components/destination/ImageCarousel';
import { Time } from '@/components/destination/Time';
import { Weather } from '@/components/destination/Weather';

export async function generateMetadata({
  params,
}: {
  params: { destination: string; locale: string };
}) {
  const [result]: { name: string }[] = await sql`
    SELECT name 
    FROM destinations 
    WHERE id = ${params.destination}
  `;

  if (!result) return;

  return {
    title: result.name,
  };
}

export default async function Destination({
  params,
}: {
  params: { destination: string; locale: string };
}) {
  unstable_setRequestLocale(params.locale);
  const t = await getTranslations('destination');
  const session = await auth();
  const user = session?.user;

  const [destination]: (Destination & {
    averageRating: number;
    reviewCount: number;
    keywords: string[];
  })[] = await sql`
    SELECT destinations.*, reviews.average_rating, reviews.review_count, keywords.keywords
    FROM destinations
    LEFT JOIN (
      SELECT destination_id, COALESCE(AVG(rating), 0) as average_rating, COUNT(rating) as review_count
      FROM reviews
      GROUP BY destination_id
    ) reviews ON destinations.id = reviews.destination_id
    LEFT JOIN (
      SELECT destination_id, ARRAY_AGG(name ORDER BY name) as keywords
      FROM destination_keywords
      JOIN keywords ON destination_keywords.keyword_id = keywords.id
      GROUP BY destination_id
    ) keywords ON destinations.id = keywords.destination_id
    WHERE destinations.id = ${params.destination}
  `;

  if (!destination) {
    notFound();
  }

  const [author]: User[] = await sql`
    SELECT * 
    FROM users 
    WHERE id = ${destination.userId}
  `;

  if (!author) {
    throw new Error('Author not found');
  }

  await sql`
    UPDATE destinations
    SET views = views + 1
    WHERE id = ${destination.id}
  `;

  const parts = destination.location.replace(/[()]/g, '').split(',');
  const coordinates: [number, number] = [
    parseFloat(parts[0]!),
    parseFloat(parts[1]!),
  ];

  interface SqlResult {
    exists: boolean;
  }

  const favorite: boolean =
    (
      (await sql`
    SELECT EXISTS (
      SELECT 1 
      FROM user_favorites 
      WHERE user_id = ${user?.id} AND destination_id = ${destination.id}
    ) as "exists"
`) as SqlResult[]
    )[0]?.exists ?? false;
  return (
    <article className='mt-12'>
      <section>
        <h1 className='mb-12 text-center text-3xl font-bold leading-tight tracking-tighter md:text-left md:text-6xl md:leading-none lg:text-7xl'>
          {destination.name}
        </h1>
        <AuthorPopover
          className='hidden md:mb-12 md:inline-flex'
          user={user}
          author={author}
          destination={destination}
          favorite={favorite}
          updateFavorite={async (favorite: boolean) => {
            'use server';
            if (!user) {
              throw new Error('You must be signed in to perform this action');
            }

            if (!favorite) {
              await sql`
                INSERT INTO user_favorites (user_id, destination_id)
                VALUES (${user.id}, ${destination.id})
              `;
            } else {
              await sql`
                DELETE FROM user_favorites
                WHERE user_id = ${user.id} AND destination_id = ${destination.id}
              `;
            }

            revalidatePath(`/[locale]/(dashboard)/${params.destination}`);
          }}
        />
        <ImageCarousel className='mb-4' destination={destination} />
        <div className='mx-auto max-w-2xl'>
          <AuthorPopover
            className='mb-6 flex md:hidden'
            user={user}
            author={author}
            destination={destination}
          />
          <div className='mb-2 flex gap-0.5 text-default-500'>
            {destination.averageRating !== 0 ? (
              <>
                <AverageRating
                  className='self-end'
                  averageRating={destination.averageRating}
                />
                <span className='self-center'>
                  {destination.reviewCount + ' '}
                  <small>{t('reviews')}</small>
                </span>
              </>
            ) : (
              <span className='self-end text-xl font-semibold italic'>
                {t('noReviews')}
              </span>
            )}
          </div>
          <div className='mb-2 flex flex-wrap'>
            <Chip
              className='mb-2 mr-2'
              color='secondary'
              key={t('worldRegion', { region: destination.worldRegion })}
            >
              {t('worldRegion', { region: destination.worldRegion })}
            </Chip>
            {destination.keywords.map((keyword) => (
              <Chip className='mb-2 mr-2' key={keyword}>
                {keyword}
              </Chip>
            ))}
          </div>
          <Time
            className='mb-6 text-lg'
            createdAt={destination.createdAt}
            modifiedAt={destination.modifiedAt}
          />
        </div>
      </section>
      <div className='prose mx-auto mb-10 max-w-2xl space-y-8 dark:prose-invert'>
        <section>
          <Markdown>{destination.content}</Markdown>
        </section>
        <section>
          <h1>{t('exclusiveTitle')}</h1>
          {user ? (
            <Markdown>{destination.exclusiveContent}</Markdown>
          ) : (
            <span className='italic text-default-500'>
              {t('exlusiveNotLoggedInDescription')}
            </span>
          )}
        </section>
        <section>
          <h1>{t('map')}</h1>
          <Map
            coordinates={coordinates}
            popup={destination.name + '\n' + destination.location}
          />
        </section>
        <section>
          <h1>{t('weather')}</h1>
          <Weather locale={params.locale} coordinates={coordinates} />
        </section>
      </div>
    </article>
  );
}
