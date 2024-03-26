import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import { notFound, redirect } from 'next/navigation';

import { auth } from '@/lib/auth';
import { type Destination, type Keyword, type User, sql } from '@/lib/db';
import {
  DeleteObjectCommand,
  PutObjectCommand,
  destinationsBucket,
  endpoint,
  reviewsBucket,
  s3,
} from '@/lib/s3';
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

export default async function EditDestination({
  params,
}: {
  params: { destination: string; locale: string };
}) {
  unstable_setRequestLocale(params.locale);
  const t = await getTranslations('destination.write');
  const session = await auth();
  const user = session?.user;

  const [destination]: (Destination & {
    keywords: string[];
  })[] = await sql`
    SELECT destinations.*, keywords.keywords
    FROM destinations
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
        if (!(user && (user.role === 'admin' || user.id === author.id))) {
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
          imageUrls: destination.images,
          worldRegions: Object.keys(worldRegionTranslations),
        }).safeParse(formDataEntries);

        if (!parsed.success) {
          return;
        }

        const destinationKeywords = destination.keywords;
        const destinationImageUrls = destination.images;

        const oldKeywords = destinationKeywords.filter((keyword) => {
          return !parsed.data.keywords.includes(keyword);
        });

        const newKeywords = parsed.data.keywords.filter((keyword) => {
          return !destinationKeywords.includes(keyword);
        });

        const oldImageUrls = destinationImageUrls.filter((imageUrl) => {
          return !parsed.data.imageUrls.includes(imageUrl);
        });

        const newImageUrls = [];

        for (const oldImageUrl of oldImageUrls) {
          if (!oldImageUrl.startsWith(endpoint)) {
            continue;
          }

          const params = {
            Bucket: destinationsBucket,
            Key: oldImageUrl.replace(
              endpoint + '/' + destinationsBucket + '/',
              '',
            ),
          };

          const deleteCommand = new DeleteObjectCommand(params);

          await s3.send(deleteCommand);
        }

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

          newImageUrls.push(
            endpoint + '/' + destinationsBucket + '/' + params.Key,
          );
        }

        parsed.data.imageUrls = [...parsed.data.imageUrls, ...newImageUrls];

        await sql.begin(async (sql): Promise<void> => {
          const [updatedDestination] = await sql`
                UPDATE destinations
                SET
                  name = ${parsed.data.title},
                  content = ${parsed.data.content},
                  exclusive_content = ${parsed.data.exclusiveContent},
                  location = POINT(${parsed.data.longitude}, ${parsed.data.latitude}),
                  world_region = ${parsed.data.worldRegion},
                  images = ${sql.array(parsed.data.imageUrls)},
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

          await sql`
              DELETE FROM destination_keywords
              WHERE destination_id = ${destination.id}
                AND keyword_id IN (
                  SELECT id
                  FROM keywords
                  WHERE name = ANY(${sql.array(oldKeywords)})
                )
            `;

          await sql`
              DELETE FROM keywords
              WHERE id NOT IN (
                SELECT keyword_id
                FROM destination_keywords
              )
                AND name = ANY(${sql.array(oldKeywords)})
            `;

          await sql`
              INSERT INTO keywords (name)
              SELECT keyword
              FROM UNNEST(${sql.array(newKeywords)}::text[]) AS keyword
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
              WHERE name = ANY(${sql.array(newKeywords)})
            `;

          const newKeywordIds = result.map((row) => row.id);

          await sql`
              INSERT INTO destination_keywords (destination_id, keyword_id)
              SELECT ${destination.id}, keyword_id
              FROM UNNEST(${sql.array(newKeywordIds)}::integer[]) AS keyword_id
            `;
        });
        redirect(`/${destination.id}`);
      }}
      deleteDestination={async () => {
        'use server';
        if (!(user && (user.role === 'admin' || user.id === author.id))) {
          throw new Error('Unauthorized');
        }

        for (const imageUrl of destination.images) {
          if (!imageUrl.startsWith(endpoint)) {
            continue;
          }

          const params = {
            Bucket: destinationsBucket,
            Key: imageUrl.replace(
              endpoint + '/' + destinationsBucket + '/',
              '',
            ),
          };

          const deleteCommand = new DeleteObjectCommand(params);

          await s3.send(deleteCommand);
        }

        const reviews: { image: string }[] = await sql`
          SELECT image
          FROM reviews
          WHERE destination_id = ${destination.id}
        `;

        for (const review of reviews) {
          if (!review.image.startsWith(endpoint)) {
            continue;
          }

          const params = {
            Bucket: reviewsBucket,
            Key: review.image.replace(endpoint + '/' + reviewsBucket + '/', ''),
          };

          const deleteCommand = new DeleteObjectCommand(params);

          await s3.send(deleteCommand);
        }

        await sql.begin(async (sql): Promise<void> => {
          await sql`
            DELETE FROM user_favorites
            WHERE destination_id = ${destination.id}
          `;

          await sql`
            DELETE FROM destination_keywords
            WHERE destination_id = ${destination.id}
          `;

          await sql`
            DELETE FROM reviews
            WHERE destination_id = ${destination.id}
          `;

          await sql`
            DELETE FROM weather_caches
            WHERE destination_id = ${destination.id}
          `;

          for (const keywordName of destination.keywords) {
            const [keyword]: Keyword[] = await sql`
              SELECT id
              FROM keywords
              WHERE name = ${keywordName}
            `;

            if (keyword) {
              const [result]: { count: number }[] = await sql`
                SELECT COUNT(*)
                FROM destination_keywords
                WHERE keyword_id = ${keyword.id}
              `;

              if (result && result.count === 0) {
                await sql`
                  DELETE FROM keywords
                  WHERE id = ${keyword.id}
                `;
              }
            }
          }

          await sql`
            DELETE FROM destinations
            WHERE id = ${destination.id}
          `;
        });
        redirect('/');
      }}
      destination={destination}
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
        delete: t('delete'),
        deleteConfirmation: t('deleteConfirmation', {
          name: destination.name,
        }),
        deleteDestination: t('deleteDestination'),
        noKeywordsFound: t('noKeywordsFound'),
      }}
    />
  );
}
