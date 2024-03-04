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
    <form
      className='my-4'
      // action={async (formData: FormData) => {
      //   'use server';

      //   if (!(user && (user.role === 'admin' || user.id === author.id))) {
      //     throw new Error('Unauthorized');
      //   }
      // }}
    >
      <h1 className='mb-10 bg-gradient-to-br from-primary to-secondary bg-clip-text font-arimo text-4xl font-bold tracking-tight text-transparent lg:text-5xl'>
        {t('editDestination')}
      </h1>
      <div className='space-y-4'>
        <Input
          labelPlacement='outside'
          name='title'
          size='lg'
          label={t('title')}
          defaultValue={destination.name}
          isRequired
        />
        <Textarea
          labelPlacement='outside'
          minRows={12}
          name='content'
          size='lg'
          defaultValue={destination.content}
          label={t('content')}
          isRequired
        />
        <Textarea
          labelPlacement='outside'
          minRows={12}
          name='exclusiveContent'
          size='lg'
          defaultValue={destination.exclusiveContent}
          label={t('exclusiveContent')}
          isRequired
        />
        {/* <div>
        <Button color='danger' variant='light' type='button' onPress={onClose}>
          {t.cancel}
        </Button>
        <SubmitButton t={{ update: t.update }} />
      </div> */}
      </div>
    </form>
  );
}
