import { User as UserAvatar } from '@nextui-org/react';
import { useTranslations } from 'next-intl';
import NextImage from 'next/image';
import readingTime from 'reading-time';

import { type User } from '@/lib/db';
import type { Destination } from '@/lib/db';
import { getInitials } from '@/lib/utils';

type AuthorAvatarProps = {
  className?: string;
  author: User;
  destination: Destination;
};

function AuthorAvatar({ className, author, destination }: AuthorAvatarProps) {
  const t = useTranslations('destination');
  const { minutes } = readingTime(destination.content);
  return (
    <UserAvatar
      className={className}
      classNames={{
        name: 'text-xl font-bold',
        description: 'text-sm',
      }}
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
      isFocusable
    />
  );
}

export { AuthorAvatar };
