import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  User as UserAvatar,
} from '@nextui-org/react';
import NextImage from 'next/image';

import { type User } from '@/lib/db';
import { getInitials } from '@/lib/utils';

import { UserCard } from '@/components/reviews/UserCard';

function AuthorPopover({
  author,
  t,
}: {
  author: User & { contributions: number };
  t: {
    contributions: string;
  };
}) {
  return (
    <Popover showArrow shouldBlockScroll placement='bottom'>
      <PopoverTrigger className='shrink-0'>
        <UserAvatar
          as='button'
          name={author.name}
          description={author.contributions + ' ' + t.contributions}
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
        <UserCard user={author} />
      </PopoverContent>
    </Popover>
  );
}

export { AuthorPopover };
