import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';

import { auth } from '@/lib/auth';
import { type Destination, type User, sql } from '@/lib/db';

import { FormFields } from '@/components/destination/FormFields';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale, namespace: 'meta' });

  return {
    title: t('editDestination'),
  };
}

export default async function Edit({
  params,
}: {
  params: { destination: string; locale: string };
}) {
  unstable_setRequestLocale(params.locale);
  const t = await getTranslations('destination.write');
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

  if (!(user && (user.role === 'admin' || user.id === author.id))) {
    notFound();
  }

  return (
    <>
      <h1 className='mb-10 mt-4 bg-gradient-to-br from-primary to-secondary bg-clip-text font-arimo text-4xl font-bold tracking-tight text-transparent lg:text-5xl'>
        {t('editDestination')}
      </h1>
      <form
      // action={async (formData: FormData) => {
      //   'use server';

      //   if (!(user && (user.role === 'admin' || user.id === author.id))) {
      //     throw new Error('Unauthorized');
      //   }
      // }}
      >
        <FormFields
          destination={destination}
          t={{
            title: t('title'),
            content: t('content'),
            exclusiveContent: t('exclusiveContent'),
            cancel: t('cancel'),
            update: t('update'),
          }}
        />
      </form>
    </>
  );
}
