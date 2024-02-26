import StarFill from '@material-symbols/svg-400/outlined/star-fill.svg';
import Star from '@material-symbols/svg-400/outlined/star.svg';
import StarHalfFill from '@material-symbols/svg-400/outlined/star_half-fill.svg';
import { Button } from '@nextui-org/react';
import {
  getFormatter,
  getTranslations,
  unstable_setRequestLocale,
} from 'next-intl/server';
import { notFound } from 'next/navigation';

import { type Destination, type User, sql } from '@/lib/db';
import { PutObjectCommand, destinationsBucket, s3 } from '@/lib/s3';
import { formatRating } from '@/lib/utils';

import { AuthorPopover } from '@/components/destination/AuthorPopover';
import { ImageCarousel } from '@/components/destination/ImageCarousel';

export async function generateMetadata({
  params,
}: {
  params: { article: string; destination: string; locale: string };
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
  params: { article: string; destination: string; locale: string };
}) {
  unstable_setRequestLocale(params.locale);
  const t = await getTranslations('destination');
  const format = await getFormatter();

  const [destination]: (Destination & {
    averageRating: number | null;
    reviewCount: number;
  })[] = await sql`
    SELECT destinations.*, COALESCE(AVG(reviews.rating), 0) as average_rating, COUNT(reviews.rating) as review_count
    FROM destinations
    LEFT JOIN reviews ON destinations.id = reviews.destination_id
    WHERE destinations.id = ${params.destination}
    GROUP BY destinations.id
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

  const rating =
    destination.averageRating !== 0
      ? formatRating(destination.averageRating!)
      : null;

  return (
    <article className='mt-12'>
      <h1 className='mb-12 text-center text-3xl font-bold leading-tight tracking-tighter md:text-left md:text-6xl md:leading-none lg:text-7xl'>
        {destination.name}
      </h1>
      <AuthorPopover
        className='hidden md:mb-12 md:inline-flex'
        author={author}
        destination={destination}
      />
      <ImageCarousel destination={destination} />
      <div className='mx-auto max-w-2xl'>
        <AuthorPopover
          className='mb-6 inline-flex md:hidden'
          author={author}
          destination={destination}
        />
        <div className='mb-6 flex gap-0.5 text-default-500'>
          {destination.averageRating !== 0 ? (
            <>
              <span
                className='self-end text-2xl font-semibold'
                aria-label={t('rating') + ': ' + rating}
              >
                {rating}
                <small className='mx-2 inline-flex self-end fill-secondary'>
                  {Array(Math.floor(Number(rating))).fill(
                    <StarFill className='size-5' />,
                  )}
                  {Number(rating) % 1 >= 0.5 && (
                    <StarHalfFill className='size-5' />
                  )}
                  {Array(
                    5 -
                      Math.floor(Number(rating)) -
                      (Number(rating) % 1 >= 0.5 ? 1 : 0),
                  ).fill(<Star className='size-5' />)}
                </small>
              </span>
              <span className='self-center'>
                {destination.reviewCount}&nbsp;
                <small>{t('reviews')}</small>
              </span>
            </>
          ) : (
            <span className='self-end text-xl font-semibold italic'>
              {t('noReviews')}
            </span>
          )}
        </div>
        <div className='mb-6 text-lg'>
          <time dateTime={destination.createdAt.toISOString()}>
            {format.dateTime(destination.createdAt, {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
        </div>
      </div>
      <div className='mx-auto max-w-2xl'>{destination.content}</div>
      <form
        action={async () => {
          'use server';
          console.log('test s3');
          const params = {
            Bucket: destinationsBucket,
            Key: 'test.txt',
            Body: 'test',
          };
          try {
            const command = new PutObjectCommand(params);
            const response = await s3.send(command);
            console.log('File uploaded successfully', response);
          } catch (err) {
            console.error('Error uploading file', err);
          }
        }}
      >
        <Button type='submit'>test s3</Button>
      </form>
    </article>
  );
}
