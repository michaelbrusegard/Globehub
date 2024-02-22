import { unstable_setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';

import { type Destination, type User, sql } from '@/lib/db';

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

  return (
    <article className='mt-12'>
      <h1 className='mb-12 text-center text-3xl font-bold leading-tight tracking-tighter md:text-left md:text-6xl md:leading-none lg:text-7xl'>
        {destination.name}
      </h1>
    </article>
  );
}
