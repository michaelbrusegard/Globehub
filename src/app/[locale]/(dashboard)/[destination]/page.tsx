import { Button } from '@nextui-org/react';
import { getFormatter, unstable_setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';

import { type Destination, type User, sql } from '@/lib/db';
import { PutObjectCommand, destinationsBucket, s3 } from '@/lib/s3';

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
  const format = await getFormatter({ locale: params.locale });

  const [destination]: Destination[] = await sql`
    SELECT * 
    FROM destinations 
    WHERE id = ${params.destination}
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
