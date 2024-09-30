import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import {
  createSearchParamsCache,
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
} from 'nuqs/server';
import { Suspense } from 'react';

import { type Keyword, sql } from '@/lib/db';

import { DestinationsGrid } from '@/components/home/DestinationsGrid';
import { DestinationsGridSkeleton } from '@/components/home/DestinationsGridSkeleton';
import { DestinationsPagination } from '@/components/home/DestinationsPagination';
import { DestinationsTabs } from '@/components/home/DestinationsTabs';
import { FilterGrid } from '@/components/home/FilterGrid';
import { Filters } from '@/components/home/Filters';

export default async function Home({
  params: { locale },
  searchParams,
}: {
  params: { locale: string };
  searchParams: {
    page?: string;
    keywords?: string;
    worldRegion?: string;
  };
}) {
  unstable_setRequestLocale(locale);
  const t = await getTranslations('home');

  const allKeywords: Keyword[] = await sql`
    SELECT * FROM keywords
    ORDER BY name ASC
  `;

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

  const reversedWorldRegionTranslations = Object.entries(
    worldRegionTranslations,
  ).reduce((acc: Record<string, string>, [key, value]) => {
    acc[value] = key;
    return acc;
  }, {});

  const orderCriteria = ['rating', 'alphabetic', 'newest', 'views', 'favorite'];

  const orderCriteriaTranslations = orderCriteria.reduce(
    (acc: Record<string, string>, criteria) => {
      acc[criteria] = t('orderCriteriaEnum', { criteria });
      return acc;
    },
    {},
  );

  const reversedCriteriaTranslations = Object.entries(
    orderCriteriaTranslations,
  ).reduce((acc: Record<string, string>, [key, value]) => {
    acc[value] = key;
    return acc;
  }, {});

  const [result]: { count: number }[] =
    await sql`SELECT COUNT(*) as count FROM destinations;`;

  const totalDestinations = result ? result.count : 0;

  const searchParamsCache = createSearchParamsCache({
    [t('order')]: parseAsString.withDefault(
      Object.values(orderCriteriaTranslations)[0]!,
    ),
    [t('page')]: parseAsInteger.withDefault(1),
    [t('keywords')]: parseAsArrayOf<string>(parseAsString, ';'),
    [t('worldRegion')]: parseAsString.withDefault(''),
  });

  searchParamsCache.parse(searchParams);

  const order = searchParamsCache.get(t('order')) as string;
  const page = searchParamsCache.get(t('page')) as number;
  const keywords = searchParamsCache.get(t('keywords')) as string[];
  const worldRegion = searchParamsCache.get(t('worldRegion')) as string;

  const orderKey = reversedCriteriaTranslations[order];
  const worldRegionKey = reversedWorldRegionTranslations[worldRegion];

  const pageSize = 5;

  return (
    <>
      <div className='flex flex-col items-center'>
        <DestinationsTabs
          orderCriteria={orderCriteriaTranslations}
          t={{
            orderDestinationsBy: t('orderDestinationsBy'),
            order: t('order'),
          }}
        />
        <Suspense fallback={<DestinationsGridSkeleton />}>
          <DestinationsGrid order={orderKey!} page={page} pageSize={pageSize} />
        </Suspense>
        <DestinationsPagination
          className='my-6'
          t={{ page: t('page') }}
          showControls
          total={Math.ceil(totalDestinations / pageSize)}
          initialPage={page}
          color='secondary'
        />
      </div>
      <div className='mb-12'>
        <h2 className='my-4 bg-gradient-to-br from-primary to-secondary bg-clip-text font-arimo text-3xl font-bold tracking-tight text-transparent lg:text-4xl'>
          {t('filterTitle')}
        </h2>
        <Filters
          keywords={allKeywords}
          worldRegions={worldRegionTranslations}
          t={{
            keywords: t('keywords'),
            selectKeywords: t('selectKeywords'),
            selectWorldRegion: t('selectWorldRegion'),
            worldRegion: t('worldRegion'),
            noKeywordsFound: t('noKeywordsFound'),
          }}
        />
        <FilterGrid
          filterKeywords={keywords}
          filterWorldRegion={worldRegionKey}
          worldRegions={worldRegionTranslations}
          pageSize={3}
        />
      </div>
    </>
  );
}
