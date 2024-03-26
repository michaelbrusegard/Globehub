import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import { notFound, redirect } from 'next/navigation';

import { auth } from '@/lib/auth';
import { sql } from '@/lib/db';
import { PutObjectCommand, destinationsBucket, endpoint, s3 } from '@/lib/s3';
import { validateDestination } from '@/lib/validation';

import { Form } from '@/components/destination/Form';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale, namespace: 'meta' });

  return {
    title: t('newDestination'),
  };
}

export default async function NewDestination({
  params,
}: {
  params: { locale: string };
}) {
  unstable_setRequestLocale(params.locale);
  const t = await getTranslations('destination.write');
  const session = await auth();
  const user = session?.user;

  if (!user) {
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

  const result: { name: string }[] = await sql`
    SELECT name 
    FROM keywords
  `;

  const allKeywords = result.map((row) => row.name);

  if (!allKeywords) {
    throw new Error('Keywords not found');
  }

  return (
    <Form
      updateDestination={async (formData: FormData) => {
        'use server';
        if (!user) {
          throw new Error('Unauthorized');
        }

        type FormDataEntries = {
          title: string;
          content: string;
          exclusiveContent: string;
          latitude: string;
          longitude: string;
          worldRegion: string;
          keywords: string | string[];
          imageUrls: string | string[];
          imageFiles: File[];
        };

        const formDataEntries: Partial<FormDataEntries> =
          Object.fromEntries(formData);

        if (typeof formDataEntries.keywords === 'string') {
          formDataEntries.keywords = JSON.parse(
            formDataEntries.keywords,
          ) as string[];
        }

        if (typeof formDataEntries.imageUrls === 'string') {
          formDataEntries.imageUrls = JSON.parse(
            formDataEntries.imageUrls,
          ) as string[];
        }

        const imageFiles: File[] = [];
        for (const [key, value] of formData.entries()) {
          if (key.startsWith('imageFiles') && value instanceof File) {
            imageFiles.push(value);
          }
        }

        formDataEntries.imageFiles = imageFiles;

        const parsed = validateDestination({
          imageFilesLength: imageFiles.length,
          worldRegions: Object.keys(worldRegionTranslations),
        }).safeParse(formDataEntries);

        if (!parsed.success) {
          return;
        }

        const [destination]: { id: number }[] = await sql.begin(
          async (sql): Promise<{ id: number }[]> => {
            const [destination]: { id: number }[] = await sql`
              INSERT INTO destinations (
                user_id,
                name,
                content,
                exclusive_content,
                location,
                world_region,
                images
              ) VALUES (
                ${user.id},
                ${parsed.data.title},
                ${parsed.data.content},
                ${parsed.data.exclusiveContent},
                POINT(${parsed.data.longitude}, ${parsed.data.latitude}),
                ${parsed.data.worldRegion},
                ${sql.array(parsed.data.imageUrls)}
              )
              RETURNING id
            `;
            if (!destination) {
              throw new Error('Destination not created');
            }

            await sql`
              INSERT INTO keywords (name)
              SELECT keyword
              FROM UNNEST(${sql.array(parsed.data.keywords)}::text[]) AS keyword
              WHERE NOT EXISTS (
                SELECT 1
                FROM keywords
                WHERE name = keyword
              )
            `;

            const result: {
              id: number;
            }[] = await sql`
              SELECT id
              FROM keywords
              WHERE name = ANY(${sql.array(parsed.data.keywords)})
            `;

            const keywordIds = result.map((row) => row.id);

            await sql`
              INSERT INTO destination_keywords (destination_id, keyword_id)
              SELECT ${destination.id}, keyword_id
              FROM UNNEST(${sql.array(keywordIds)}::integer[]) AS keyword_id
            `;

            return [destination];
          },
        );

        if (!destination) {
          throw new Error('Destination not created');
        }

        const imageUrls = [];

        for (const [index, imageFile] of imageFiles.entries()) {
          const uniqueFileName = `${Date.now()}-${index}`;
          const arrayBuffer = await imageFile.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);

          const params = {
            Bucket: destinationsBucket,
            Key: `${destination.id}/${uniqueFileName}`,
            Body: buffer,
          };

          const command = new PutObjectCommand(params);

          await s3.send(command);

          imageUrls.push(
            endpoint + '/' + destinationsBucket + '/' + params.Key,
          );
        }

        await sql`
          UPDATE destinations
          SET images = ${sql.array(imageUrls)}
          WHERE id = ${destination.id}
        `;

        redirect(`/${destination.id}`);
      }}
      allKeywords={allKeywords}
      worldRegions={worldRegionTranslations}
      t={{
        details: t('details'),
        title: t('title'),
        writeTitle: t('writeTitle'),
        content: t('content'),
        writeContent: t('writeContent'),
        exclusiveContent: t('exclusiveContent'),
        writeExclusiveContent: t('writeExclusiveContent'),
        cancel: t('cancel'),
        submit: t('create'),
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
        youCanUseMarkdown: t('youCanUseMarkdown'),
        latitudeInvalid: t('latitudeInvalid'),
        latitudeDecimalsInvalid: t('latitudeDecimalsInvalid'),
        longitudeInvalid: t('longitudeInvalid'),
        longitudeDecimalsInvalid: t('longitudeDecimalsInvalid'),
        worldRegionInvalid: t('worldRegionInvalid'),
        worldRegionPlaceholder: t('worldRegionPlaceholder'),
        keywordsLabel: t('keywordsLabel'),
        keywordsPlaceholder: t('keywordsPlaceholder'),
        add: t('add'),
        keywordTooShort: t('keywordTooShort'),
        keywordTooLong: t('keywordTooLong'),
        keywordNoSpaces: t('keywordNoSpaces'),
        keywordDuplicate: t('keywordDuplicate'),
        keywordsRequired: t('keywordsRequired'),
        keywordsMax: t('keywordsMax'),
        keywordFirstLetterCapital: t('keywordFirstLetterCapital'),
        images: t('images'),
        removeImage: t('removeImage'),
        PngJpg1MbMax: t('PngJpg1MbMax'),
        uploadAFile: t('uploadAFile'),
        orDragAndDrop: t('orDragAndDrop'),
        imageNameTooLong: t('imageNameTooLong'),
        imageTypeInvalid: t('imageTypeInvalid'),
        imageSizeTooLarge: t('imageSizeTooLarge'),
        tooFewImages: t('tooFewImages'),
        tooManyImages: t('tooManyImages'),
        delete: '',
        deleteConfirmation: '',
        deleteDestination: '',
        noKeywordsFound: t('noKeywordsFound'),
      }}
    />
  );
}
