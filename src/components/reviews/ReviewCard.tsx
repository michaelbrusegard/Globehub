import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Image,
  User as UserAvatar,
} from '@nextui-org/react';
import NextImage from 'next/image';

import { type Review, type User } from '@/lib/db';
import { getInitials } from '@/lib/utils';

import { Time } from '@/components/reusables/Time';
import { AuthorPopover } from '@/components/reviews/AuthorPopover';
import { Rating } from '@/components/reviews/Rating';

type ReviewCardProps = {
  review: Review;
  author: User & { contributions: number };
  disablePopover?: boolean;
  t: {
    contributions: string;
    modified: string;
    memberSince?: string;
    noBio?: string;
    reviewImage: string;
  };
};

function ReviewCard({
  review,
  author,
  disablePopover = false,
  t,
}: ReviewCardProps) {
  return (
    <Card>
      <CardHeader className='flex flex-col items-start justify-between gap-4 sm:flex-row'>
        {disablePopover ? (
          <UserAvatar
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
        ) : (
          <AuthorPopover
            author={author}
            t={{
              contributions: t.contributions,
              memberSince: t.memberSince ?? '',
              noBio: t.noBio ?? '',
            }}
          />
        )}
        <Time
          className='flex flex-col text-xs'
          createdAt={review.createdAt}
          modifiedAt={review.modifiedAt}
          t={{
            modified: t.modified,
          }}
        />
      </CardHeader>
      <CardBody className='flex flex-col-reverse justify-between gap-4 sm:flex-row'>
        <div>
          <Rating rating={review.rating} />
          <p className='text-sm text-default-900'>{review.comment}</p>
        </div>
        {review.image && (
          <div className='shrink-0'>
            <Image
              className='aspect-video h-28 object-cover object-center'
              as={NextImage}
              alt={t.reviewImage}
              src={review.image}
              width={199}
              height={112}
            />
          </div>
        )}
      </CardBody>
      <CardFooter />
    </Card>
  );
}

export { ReviewCard };
