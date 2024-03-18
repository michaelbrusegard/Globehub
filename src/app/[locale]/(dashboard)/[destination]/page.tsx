import { Chip, cn } from '@nextui-org/react';
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
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

  return (
    <article className='my-12'>
      <section>
        <h1 className='mb-14 text-center text-3xl font-bold leading-tight tracking-tighter md:text-left md:text-6xl md:leading-none lg:text-7xl'>
          {destination.name}
        </h1>
        <AuthorPopover
          className='hidden justify-between md:mb-12 md:flex'
          user={user}
          author={author}
          destination={destination}
        />
        <ImageCarousel className='mb-4' destination={destination} />
        <div className='mx-auto max-w-2xl'>
          <AuthorPopover
            className={cn(
              'mb-6 flex justify-between gap-2 sm:flex-row sm:items-center md:hidden',
              (user?.role === 'admin' || user?.id === author.id) && 'flex-col',
            )}
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
                  <small>{t('reviews.title')}</small>
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
              key={destination.worldRegion}
            >
              {t('write.worldRegionEnum', { region: destination.worldRegion })}
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
      <div className='mx-auto mb-10 max-w-2xl space-y-8'>
        <section className='prose dark:prose-invert'>
          <Markdown>{destination.content}</Markdown>
        </section>
        <section className='prose dark:prose-invert'>
          <h1>{t('exclusiveTitle')}</h1>
          {user ? (
            <Markdown>{destination.exclusiveContent}</Markdown>
          ) : (
            <span className='italic text-default-500'>
              {t('exlusiveNotLoggedInDescription')}
            </span>
          )}
        </section>
        <section className='prose dark:prose-invert'>
          <h1>{t('map')}</h1>
          <Map
            location={destination.location}
            popup={destination.name + '\n' + destination.location}
          />
        </section>
        <section>
          <span className='prose dark:prose-invert'>
            <h1 className='mb-2'>{t('weather.title')}</h1>
          </span>
          <Weather
            locale={params.locale}
            location={destination.location}
            destinationId={destination.id}
          />
        </section>
        <section className='prose dark:prose-invert'>
          <h1>{t('reviews.title')}</h1>
        </section>
      </div>
    </article>
  );
}
