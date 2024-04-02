import { type Destination, sql } from '@/lib/db';
import { cn } from '@/lib/utils';
import { seededRandom } from '@/lib/utils';

import { DestinationCard } from '@/components/home/DestinationCard';

async function DestinationsGrid({
  order,
  page,
  pageSize,
}: {
  order: string;
  page: number;
  pageSize: number;
}) {
  const destinations: (Destination & {
    averageRating: number;
    favoriteCount: number;
  })[] = await sql`
    SELECT * FROM (
      SELECT destinations.*, COALESCE(AVG(reviews.rating), 0) as average_rating, COALESCE(COUNT(user_favorites.destination_id), 0) as favorite_count
      FROM destinations
      LEFT JOIN reviews ON destinations.id = reviews.destination_id
      LEFT JOIN user_favorites ON destinations.id = user_favorites.destination_id
      GROUP BY destinations.id
    ) as subquery
    ORDER BY 
      CASE WHEN ${order} = 'rating' THEN average_rating END DESC,
      CASE WHEN ${order} = 'alphabetic' THEN name END ASC,
      CASE WHEN ${order} = 'newest' THEN created_at END DESC,
      CASE WHEN ${order} = 'views' THEN views END DESC,
      CASE WHEN ${order} = 'favorite' THEN favorite_count END DESC,
      CASE WHEN ${order} NOT IN ('alphabetic', 'rating', 'newest', 'views') THEN average_rating END DESC
    LIMIT ${pageSize} OFFSET ${(page - 1) * pageSize};
  `;

  if (!destinations) {
    throw new Error('Destinations not found');
  }

  const randomSmNextMap = {
    0: 1,
    1: 0,
    3: 4,
    4: 3,
  };
  const randomXs = [0, 2, 4][Math.floor(seededRandom(page) * 3)];
  const randomSm = [0, 1, 3, 4][Math.floor(seededRandom(page + 1) * 4)];
  const randomSmNext =
    randomSmNextMap[randomSm as keyof typeof randomSmNextMap];
  return (
    <div
      className={cn(
        'grid w-full grid-cols-12 grid-rows-2 gap-2 px-8',
        destinations.length === 5 && 'h-[1532px] xs:h-[916px] sm:h-[608px]',
      )}
    >
      {destinations.map((destination, index) => (
        <div
          key={destination.id}
          className={cn(
            index === 0 && 'col-span-12 xs:col-span-6 sm:col-span-4',
            index === 1 && 'col-span-12 xs:col-span-6 sm:col-span-4',
            index === 2 && 'col-span-12 xs:col-span-6 sm:col-span-4',
            index === 3 && 'col-span-12 xs:col-span-6 sm:col-span-4',
            index === 4 && 'col-span-12 xs:col-span-6 sm:col-span-4',
            index === randomXs && 'xs:col-span-12',
            index === randomSm && 'sm:col-span-7',
            index === randomSmNext && 'sm:col-span-5',
          )}
        >
          <DestinationCard destination={destination} order={order} />
        </div>
      ))}
    </div>
  );
}

export { DestinationsGrid };
