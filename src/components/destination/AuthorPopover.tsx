import {
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

import { EditButton } from '@/components/destination/EditButton';
import { FavoriteButton } from '@/components/destination/FavoriteButton';
import { UserCard } from '@/components/destination/UserCard';

type AuthorPopoverProps = {
  className?: string;
  user: User | undefined;
  author: User;
  destination: Destination;
};

async function AuthorPopover({
  className,
  user,
  author,
  destination,
}: AuthorPopoverProps) {
  const t = useTranslations('destination');
  const { minutes } = readingTime(destination.content);

  type SqlResult = {
    exists: boolean;
  };

  async function getFavorite() {
    if (user) {
      return (
        (
          (await sql`
      SELECT EXISTS (
        SELECT 1 
        FROM user_favorites 
        WHERE user_id = ${user?.id} AND destination_id = ${destination?.id}
      ) as "exists"
  `) as SqlResult[]
        )[0]?.exists ?? false
      );
    } else {
      return false;
    }
  }

  const favorite: boolean = await getFavorite();

  return (
    <div className={cn('w-full items-center justify-between', className)}>
      <Popover showArrow shouldBlockScroll placement='bottom'>
        <PopoverTrigger>
          <UserAvatar
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
<<<<<<< src/components/destination/AuthorPopover.tsx
      {user && (user.role === 'admin' || user.id === author.id) && (
        <EditButton
          destinationId={destination.id}
          t={{
            edit: t('edit'),
          }}
        />
      )}
=======
      <div>
        {user && (
          <FavoriteButton
            destination={destination}
            favorite={favorite}
            updateFavorite={async (favorite: boolean) => {
              'use server';
              if (!user) {
                throw new Error('You must be signed in to perform this action');
              }
              if (!favorite) {
                await sql`
                  INSERT INTO user_favorites (user_id, destination_id)
                  VALUES (${user?.id}, ${destination.id})
                `;
              } else {
                await sql`
                  DELETE FROM user_favorites
                  WHERE user_id = ${user?.id} AND destination_id = ${destination.id}
                `;
              }
              revalidatePath(`/[locale]/(dashboard)/${destination.id}`);
            }}
          ></FavoriteButton>
        )}
        {user && (user.role === 'admin' || user.id === author.id) && (
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
            {t('edit')}
          </Button>
        )}
      </div>
>>>>>>> src/components/destination/AuthorPopover.tsx
    </div>
  );
}

export { AuthorPopover };
