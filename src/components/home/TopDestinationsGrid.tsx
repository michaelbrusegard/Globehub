import { type Destination, sql } from '@/lib/db';
import { cn } from '@/lib/utils';

import { DestinationCard } from '@/components/home/DestinationCard';

async function TopDestinationsGrid({
  page,
  pageSize,
}: {
  page: number;
  pageSize: number;
}) {
  const destinations: (Destination & { averageRating: number | null })[] =
    await sql`
      SELECT destinations.*, COALESCE(AVG(reviews.rating), 0) as average_rating
      FROM destinations
      LEFT JOIN reviews ON destinations.id = reviews.destination_id
      GROUP BY destinations.id
      ORDER BY average_rating DESC
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
  const randomXs = [0, 2, 4][Math.floor(Math.random() * 3)];
  const randomSm = [0, 1, 3, 4][Math.floor(Math.random() * 4)];
  const randomSmNext =
    randomSmNextMap[randomSm as keyof typeof randomSmNextMap];
  return (
    <div className='grid h-[1532px] w-full grid-cols-12 grid-rows-2 gap-2 px-8 xs:h-[916px] sm:h-[608px]'>
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
          <DestinationCard destination={destination} />
        </div>
      ))}
    </div>
  );
}

export { TopDestinationsGrid };
