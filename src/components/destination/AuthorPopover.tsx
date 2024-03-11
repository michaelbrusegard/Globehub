import EditSquare from '@material-symbols/svg-400/outlined/edit_square.svg';
import {
  Button,
  Link,
  Popover,
  PopoverContent,
  PopoverTrigger,
  User as UserAvatar,
} from '@nextui-org/react';
import { useTranslations } from 'next-intl';
import { revalidatePath } from 'next/cache';
import NextImage from 'next/image';
import readingTime from 'reading-time';

import { type User } from '@/lib/db';
import { type Destination, sql } from '@/lib/db';
import { cn, getInitials } from '@/lib/utils';

import { FavoriteButton } from '@/components/destination/FavoriteButton';
import { UserCard } from '@/components/destination/UserCard';

type AuthorPopoverProps = {
  className?: string;
  user: User | undefined;
  author: User;
  destination: Destination;
};

type ButtonProps = {
  user: User | undefined;
  author: User;
  destination: Destination;
  t: {
    edit: string;
    favorite: string;
  };
};

function AuthorPopover({
  className,
  user,
  author,
  destination,
}: AuthorPopoverProps) {
  const t = useTranslations('destination');
  const { minutes } = readingTime(destination.content);

  return (
    <div className={cn('w-full', className)}>
      <Popover showArrow shouldBlockScroll placement='bottom'>
        <PopoverTrigger>
          <UserAvatar
            className='justify-start'
            classNames={{
              name: 'text-xl font-bold',
              description: 'text-sm',
            }}
            as='button'
            name={author.name}
            description={
              t('readTime', { count: Math.ceil(minutes) }) +
              String.fromCharCode(160) +
              ' • ' +
              String.fromCharCode(160) +
              t('views', { count: destination.views })
            }
            avatarProps={{
              classNames: {
                name: 'font-arimo font-semibold',
              },
              ImgComponent: NextImage,
              imgProps: {
                width: 48,
                height: 48,
                fetchPriority: 'high',
                loading: 'eager',
              },
              size: 'lg',
              name: getInitials(author.name!),
              src: author.image,
              'aria-hidden': true,
            }}
          />
        </PopoverTrigger>
        <PopoverContent className='p-1'>
          <UserCard user={author} />
        </PopoverContent>
      </Popover>
      <Buttons
        user={user}
        author={author}
        destination={destination}
        t={{
          edit: t('edit'),
          favorite: t('favorite'),
        }}
      />
    </div>
  );
}

async function Buttons({ user, author, destination, t }: ButtonProps) {
  if (!user) {
    return null;
  }

  const [result]: { exists: boolean }[] = await sql`
    SELECT EXISTS (
      SELECT 1 
      FROM user_favorites 
      WHERE user_id = ${user.id} AND destination_id = ${destination?.id}
    ) as "exists"
  `;

  if (!result) {
    return null;
  }

  return (
    <div className='space-x-2'>
      <FavoriteButton
        favorite={result.exists}
        t={{ favorite: t.favorite }}
        updateFavorite={async () => {
          'use server';

          if (!user) {
            throw new Error('You must be signed in to perform this action');
          }

          if (!result.exists) {
            await sql`
                  INSERT INTO user_favorites (user_id, destination_id)
                  VALUES (${user.id}, ${destination.id})
                `;
          } else {
            await sql`
                  DELETE FROM user_favorites
                  WHERE user_id = ${user.id} AND destination_id = ${destination.id}
                `;
          }

          revalidatePath(`/[locale]/(dashboard)/${destination.id}`);
        }}
      />
      {(user.role === 'admin' || user.id === author.id) && (
        <Button
          as={Link}
          href={'/' + destination.id + '/edit'}
          color='warning'
          radius='sm'
          startContent={
            <EditSquare
              className='size-5 fill-warning-foreground'
              aria-hidden='true'
            />
          }
        >
          {t.edit}
        </Button>
      )}
    </div>
  );
}

export { AuthorPopover };
