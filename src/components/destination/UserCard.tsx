import {
  Avatar,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
} from '@nextui-org/react';
import { getFormatter, getTranslations } from 'next-intl/server';

import { getSql } from '@/lib/db';
import type { User } from '@/lib/db';

async function UserCard({ user }: { user: User }) {
  const t = await getTranslations('destination');
  const sql = getSql();
  const format = await getFormatter();
  const [result]: { count: number }[] = await sql`
    SELECT COUNT(*)
    FROM destinations
    WHERE user_id = ${user.id}
  `;

  return (
    <Card shadow='none' className='max-w-[300px] border-none bg-transparent'>
      <CardHeader className='justify-between'>
        <div className='flex gap-3'>
          <Avatar isBordered radius='full' size='md' src={user.image} />
          <div className='flex flex-col items-start justify-center'>
            <h4 className='text-small font-semibold leading-none text-default-600'>
              {user.name}
            </h4>
            <h5 className='text-xs tracking-tight text-default-500'>
              {t('memberSince')}{' '}
              {format.dateTime(user.createdAt, {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
              <br />
              {result ? t('articlesWritten', { count: result.count }) : null}
            </h5>
          </div>
        </div>
      </CardHeader>
      <CardBody className='px-3 py-0'>
        {user.bio ? (
          <p className='pl-px text-small text-default-500'>{user.bio}</p>
        ) : (
          <p className='pl-px text-small italic text-default-500'>
            {t('noBio')}
          </p>
        )}
      </CardBody>
      <CardFooter />
    </Card>
  );
}

export { UserCard };
