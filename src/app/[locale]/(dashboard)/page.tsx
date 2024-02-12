import { unstable_setRequestLocale } from 'next-intl/server';

import { type User, sql } from '@/lib/db';

export default async function Home({
  params: { locale },
}: {
  params: { locale: string };
}) {
  unstable_setRequestLocale(locale);
  const data: User[] = await sql`SELECT * FROM users;`;
  return (
    <div className='h-[150vh]'>
      <h2>Landing Page</h2>
      {data.map((user) => {
        return (
          <div key={user.id}>
            {user.name} - {user.email}
          </div>
        );
      })}
    </div>
  );
}
