import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import { notFound, redirect } from 'next/navigation';

import { auth } from '@/lib/auth';
import { type Destination, type User, sql } from '@/lib/db';
import { validateDestination } from '@/lib/validation';

import { Form } from '@/components/destination/Form';

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

export default async function DestinationEdit({
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

  const worldRegions: {
    enumlabel: string;
  }[] = await sql`
    SELECT enumlabel 
    FROM pg_enum 
    WHERE enumtypid = (
      SELECT oid 
      FROM pg_type 
      WHERE typname = 'world_regions'
    )
  `;

  if (!worldRegions) {
    throw new Error('World regions not found');
  }

  const worldRegionTranslations = worldRegions.reduce(
    (acc: Record<string, string>, region) => {
      acc[region.enumlabel] = t('worldRegionEnum', {
        region: region.enumlabel,
      });
      return acc;
    },
    {},
  );

  return (
    <>
      <h1 className='mb-10 mt-4 bg-gradient-to-br from-primary to-secondary bg-clip-text font-arimo text-4xl font-bold tracking-tight text-transparent lg:text-5xl'>
        {t('editDestination')}
      </h1>
      <Form
        updateDestination={async (formData: FormData) => {
          'use server';

          if (!(user && (user.role === 'admin' || user.id === author.id))) {
            throw new Error('Unauthorized');
          }

          const parsed = validateDestination({
            worldRegions: Object.keys(worldRegionTranslations),
          }).safeParse(
            Object.fromEntries(formData) as {
              title: string;
              content: string;
              exclusiveContent: string;
              latitude: string;
              longitude: string;
              worldRegion: string;
            },
          );

          if (!parsed.success) {
            return;
          }

          const [updatedDestination] = await sql`
                UPDATE destinations
                SET
                  name = ${parsed.data.title},
                  content = ${parsed.data.content},
                  exclusive_content = ${parsed.data.exclusiveContent},
                  location = POINT(${parsed.data.longitude}, ${parsed.data.latitude}),
                  world_region = ${parsed.data.worldRegion},
                  modified_at = NOW()
                WHERE id = ${destination.id}
                RETURNING *
              `;

          if (
            updatedDestination &&
            destination.location !== updatedDestination.location
          ) {
            await sql`
                DELETE FROM weather_caches
                WHERE destination_id = ${destination.id}
              `;
          }

          redirect(`/${destination.id}`);
        }}
        destination={destination}
        worldRegions={worldRegionTranslations}
        t={{
          title: t('title'),
          writeTitle: t('writeTitle'),
          content: t('content'),
          writeContent: t('writeContent'),
          exclusiveContent: t('exclusiveContent'),
          writeExclusiveContent: t('writeExclusiveContent'),
          cancel: t('cancel'),
          submit: t('update'),
          latitude: t('latitude'),
          latitudePlaceholder: t('latitudePlaceholder'),
          longitude: t('longitude'),
          longitudePlaceholder: t('longitudePlaceholder'),
          worldRegion: t('worldRegion'),
          titleTooLong: t('titleTooLong'),
          titleTooShort: t('titleTooShort'),
          contentTooShort: t('contentTooShort'),
          contentTooLong: t('contentTooLong'),
          exclusiveContentTooShort: t('exclusiveContentTooShort'),
          exclusiveContentTooLong: t('exclusiveContentTooLong'),
          latitudeInvalid: t('latitudeInvalid'),
          latitudeDecimalsInvalid: t('latitudeDecimalsInvalid'),
          longitudeInvalid: t('longitudeInvalid'),
          longitudeDecimalsInvalid: t('longitudeDecimalsInvalid'),
          worldRegionInvalid: t('worldRegionInvalid'),
          worldRegionPlaceholder: t('worldRegionPlaceholder'),
        }}
      />
    </>
  );
}
