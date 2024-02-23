import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  User as UserAvatar,
} from '@nextui-org/react';
import { useTranslations } from 'next-intl';
import NextImage from 'next/image';
import readingTime from 'reading-time';

import { type User } from '@/lib/db';
import type { Destination } from '@/lib/db';
import { getInitials } from '@/lib/utils';

import { UserCard } from '@/components/destination/UserCard';

type AuthorAvatarProps = {
  className?: string;
  author: User;
  destination: Destination;
};

function AuthorPopover({ className, author, destination }: AuthorAvatarProps) {
  const t = useTranslations('destination');
  const { minutes } = readingTime(destination.content);
  return (
    <Popover showArrow placement='bottom'>
      <PopoverTrigger className={className}>
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
  );
}

export { AuthorPopover };
