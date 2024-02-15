import { unstable_setRequestLocale } from 'next-intl/server';

import { type Destination, sql } from '@/lib/db';

import { card as Card } from '@/components/layout/DestinationCard';

export default async function Destination({
  params: { locale },
}: {
  params: { locale: string };
}) {
  unstable_setRequestLocale(locale);
  const data: Destination[] = await sql`SELECT * FROM destinations;`;

  return (
    <div className='grid grid-cols-3 items-stretch gap-4'>
      <h1></h1>
      {data.map((destination, index) => (
        <Card key={index} destination={destination} />
      ))}
    </div>
  );
}
