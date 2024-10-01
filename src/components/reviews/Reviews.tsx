'use client';

import { Button, Spinner } from '@nextui-org/react';
import { useEffect, useState, useTransition } from 'react';

import { type Review, type User } from '@/lib/db';

import { ReviewCard } from '@/components/reviews/ReviewCard';

type ReviewsProps = {
  initialReviews: Review[];
  initialAuthors: (User & { contributions: number })[];
  getReviews: (page: number) => Promise<{
    reviews: Review[];
    authors: (User & { contributions: number })[];
  }>;
  totalReviews: number;
  t: {
    noReviews: string;
    contributions: string;
    modified: string;
    memberSince: string;
    noBio: string;
    loadMore: string;
    loadingMoreReviews: string;
    reviewImage: string;
  };
};

function Reviews({
  initialReviews,
  initialAuthors,
  totalReviews,
  getReviews,
  t,
}: ReviewsProps) {
  const [page, setPage] = useState(2);
  const [isPending, startTransition] = useTransition();
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [authors, setAuthors] =
    useState<(User & { contributions: number })[]>(initialAuthors);

  useEffect(() => {
    setReviews(initialReviews);
    setAuthors(initialAuthors);
    setPage(2);
  }, [initialReviews, initialAuthors]);

  console.log(totalReviews);

  if (totalReviews === 0) {
    return <span className='italic text-default-500'>{t.noReviews}</span>;
  }

  async function fetchReviews() {
    startTransition(async () => {
      const { reviews: newReviews, authors: newAuthors } =
        await getReviews(page);

      setReviews((prevReviews) => [...prevReviews, ...newReviews]);
      setAuthors((prevAuthors) => [...prevAuthors, ...newAuthors]);
      setPage((prevPage) => prevPage + 1);
    });
  }

  return (
    <>
      <ul className='flex flex-col gap-2'>
        {reviews.map((review) => {
          const author = authors.find((author) => author.id === review.userId);

          if (!author) {
            throw new Error('Author not found');
          }

          return (
            <li key={`${review.userId}-${review.destinationId}`}>
              <ReviewCard
                review={review}
                author={author}
                t={{
                  contributions: t.contributions,
                  modified: t.modified,
                  memberSince: t.memberSince,
                  noBio: t.noBio,
                  reviewImage: t.reviewImage,
                }}
              />
            </li>
          );
        })}
      </ul>
      <div className='m-4 flex min-h-56 flex-col justify-start gap-2'>
        {isPending ? (
          <Spinner color='primary' label={t.loadingMoreReviews} />
        ) : (
          totalReviews > reviews.length && (
            <Button
              className='sm:mx-auto'
              variant='faded'
              onPress={async () => {
                await fetchReviews();
              }}
            >
              {t.loadMore}
            </Button>
          )
        )}
      </div>
    </>
  );
}

export { Reviews };
