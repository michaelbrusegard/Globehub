import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import {
  createSearchParamsCache,
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
} from 'nuqs/server';

import { sql } from '@/lib/db';

import { DestinationsPagination } from '@/components/home/DestinationsPagination';
import { SearchBar } from '@/components/home/SearchBar';
import { TopDestinationsGrid } from '@/components/home/TopDestinationsGrid';

export default async function Home({
  params: { locale },
  searchParams,
}: {
  params: { locale: string };
  searchParams: Record<string, string | string[] | undefined>;
}) {
  unstable_setRequestLocale(locale);
  const [result]: { count: number }[] =
    await sql`SELECT COUNT(*) as count FROM destinations;`;
  const totalDestinations = result!.count;
  const t = await getTranslations('ui');

  const searchParamsCache = createSearchParamsCache({
    [t('page')]: parseAsInteger.withDefault(1),
  });

  const { [t('page')]: page = 1 } = searchParamsCache.parse(searchParams);
  const pageSize = 5;

  const filterCache = createSearchParamsCache({
    ['filters']: parseAsArrayOf<string>(parseAsString.withDefault(''), ';'),
  });

  const { ['filters']: filters = [] } = filterCache.parse(searchParams);

  const worldRegionCache = createSearchParamsCache({
    ['world_region']: parseAsString.withDefault(''),
  });

  const { ['world_region']: worldRegion = '' } =
    worldRegionCache.parse(searchParams);

  return (
    <div>
      <div>
        <SearchBar />
      </div>
      <div className='flex flex-col items-center'>
        <TopDestinationsGrid
          page={page}
          pageSize={pageSize}
          keywords={filters}
          worldRegion={worldRegion}
        />
        <DestinationsPagination
          className='my-6'
          t={{ page: t('page') }}
          showControls
          total={Math.ceil(totalDestinations / pageSize)}
          initialPage={page}
          color='secondary'
        />
      </div>
    </div>
  );
}
