import { Input, Textarea } from '@nextui-org/react';
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';

import { auth } from '@/lib/auth';
import { type Destination, type User, sql } from '@/lib/db';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale, namespace: 'meta' });

  return {
    title: t('writeDestination'),
  };
}

export default async function Edit({
  params,
}: {
  params: { destination: string; locale: string };
}) {
  unstable_setRequestLocale(params.locale);
  const t = await getTranslations('writeDestination');
  const session = await auth();
  const user = session?.user;

  const [destination]: Destination[] = await sql`
    SELECT *
    FROM destinations
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
  // && user.id === author.id
  if (!(user && user.role === 'admin')) {
    notFound();
  }

  return (
    <form
      action={async (data: FormData) => {
        'use server';

        if (!(user && user.role === 'admin' && user.id === author.id)) {
          throw new Error('Unauthorized');
        }
      }}
    >
      <Input
        name='title'
        size='lg'
        label={t('title')}
        defaultValue={destination.name}
      />
    </form>
  );
}
