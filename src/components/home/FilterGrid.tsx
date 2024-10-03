import { type Destination, getSql } from '@/lib/db';

import { FilterCard } from '@/components/home/FilterCard';

type FilterGridProps = {
  filterKeywords?: string[];
  filterWorldRegion?: string;
  pageSize: number;
  worldRegions: Record<string, string>;
};

async function FilterGrid({
  filterKeywords,
  filterWorldRegion,
  pageSize,
  worldRegions,
}: FilterGridProps) {
  const sql = getSql();

  let filteredDestinations: (Destination & { keywords: string[] })[] = [];

  if (!filterWorldRegion && !filterKeywords) {
    filteredDestinations = await sql`
        SELECT d.*, array_agg(k.name) as keywords
        FROM destinations d
        LEFT JOIN destination_keywords dk ON dk.destination_id = d.id
        LEFT JOIN keywords k ON dk.keyword_id = k.id
        GROUP BY d.id
        LIMIT ${pageSize}
    `;
  } else if (!filterWorldRegion && filterKeywords) {
    filteredDestinations = await sql`
        SELECT d.*, array_agg(k.name) as keywords
        FROM destinations d
        LEFT JOIN destination_keywords dk ON dk.destination_id = d.id
        LEFT JOIN keywords k ON dk.keyword_id = k.id
        WHERE (
            SELECT COUNT(*)
            FROM destination_keywords dk
            JOIN keywords k ON dk.keyword_id = k.id
            WHERE dk.destination_id = d.id
            AND k.name = ANY(${sql.array(filterKeywords)}::text[])
        ) = ${filterKeywords.length}
        GROUP BY d.id
        LIMIT ${pageSize}
    `;
  } else if (!filterKeywords && filterWorldRegion) {
    filteredDestinations = await sql`
        SELECT d.*, array_agg(k.name) as keywords
        FROM destinations d
        LEFT JOIN destination_keywords dk ON dk.destination_id = d.id
        LEFT JOIN keywords k ON dk.keyword_id = k.id
        WHERE d.world_region = ${filterWorldRegion}
        GROUP BY d.id
        LIMIT ${pageSize}
    `;
  } else if (filterKeywords && filterWorldRegion) {
    filteredDestinations = await sql`
        SELECT d.*, array_agg(k.name) as keywords
        FROM destinations d
        LEFT JOIN destination_keywords dk ON dk.destination_id = d.id
        LEFT JOIN keywords k ON dk.keyword_id = k.id
        WHERE d.world_region = ${filterWorldRegion}
        AND (
            SELECT COUNT(*)
            FROM destination_keywords dk
            JOIN keywords k ON dk.keyword_id = k.id
            WHERE dk.destination_id = d.id
            AND k.name = ANY(${sql.array(filterKeywords)}::text[])
        ) = ${filterKeywords.length}
        GROUP BY d.id
        LIMIT ${pageSize}
    `;
  }

  return (
    <div className='mt-2 flex flex-wrap gap-2'>
      {filteredDestinations.map((destination) => (
        <FilterCard
          key={destination.id}
          destination={destination}
          worldRegions={worldRegions}
        />
      ))}
    </div>
  );
}

export { FilterGrid };
