import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import {
  createSearchParamsCache,
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
} from 'nuqs/server';

import { type Keyword, sql } from '@/lib/db';

import { DestinationsPagination } from '@/components/home/DestinationsPagination';
import { FilterGrid } from '@/components/home/FilterGrid';
import { Filters } from '@/components/home/Filters';
import { TopDestinationsGrid } from '@/components/home/TopDestinationsGrid';

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

  const [result]: { count: number }[] =
    await sql`SELECT COUNT(*) as count FROM destinations;`;

  const totalDestinations = result ? result.count : 0;

  const searchParamsCache = createSearchParamsCache({
    [t('page')]: parseAsInteger.withDefault(1),
    [t('keywords')]: parseAsArrayOf<string>(parseAsString, ';').withDefault([]),
    [t('worldRegion')]: parseAsString.withDefault(''),
  });

  searchParamsCache.parse(searchParams);

  const page = searchParamsCache.get(t('page')) as number;
  const keywords = searchParamsCache.get(t('keywords')) as string[];
  const worldRegion = searchParamsCache.get(t('worldRegion')) as string;

  const worldRegionKey = reversedWorldRegionTranslations[worldRegion];

  const pageSize = 5;

  return (
    <>
      <div className='flex flex-col items-center'>
        <TopDestinationsGrid page={page} pageSize={pageSize} />
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
            keywordSearchParam: t('keywords'),
          }}
        />
        <FilterGrid
          filterKeywords={keywords}
          filterWorldRegion={worldRegionKey}
          worldRegions={worldRegionTranslations}
          pageSize={pageSize}
        />
      </div>
    </>
  );
}
