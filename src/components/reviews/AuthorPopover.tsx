import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  User as UserAvatar,
} from '@nextui-org/react';
import { useTranslations } from 'next-intl';
import NextImage from 'next/image';

import { type User } from '@/lib/db';
import { getInitials } from '@/lib/utils';

import { UserCard } from '@/components/reviews/UserCard';

function AuthorPopover({
  author,
}: {
  author: User & { contributions: number };
}) {
  const t = useTranslations('reviews');
  return (
    <Popover showArrow shouldBlockScroll placement='bottom'>
      <PopoverTrigger className='flex-shrink-0'>
        <UserAvatar
          as='button'
          name={author.name}
          description={author.contributions + ' ' + t('contributions')}
          avatarProps={{
            classNames: {
              name: 'font-arimo font-semibold',
            },
            ImgComponent: NextImage,
            imgProps: {
              width: 32,
              height: 32,
            },
            size: 'sm',
            name: getInitials(author.name ?? ''),
            src: author.image,
          }}
        />
      </PopoverTrigger>
      <PopoverContent className='p-1'>
        {/* <UserCard user={author} /> */}
      </PopoverContent>
    </Popover>
  );
}

export { AuthorPopover };
