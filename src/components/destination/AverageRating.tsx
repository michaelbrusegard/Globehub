import StarFill from '@material-symbols/svg-400/outlined/star-fill.svg';
import Star from '@material-symbols/svg-400/outlined/star.svg';
import StarHalfFill from '@material-symbols/svg-400/outlined/star_half-fill.svg';
import { useTranslations } from 'next-intl';

import { cn, formatRating } from '@/lib/utils';

function AverageRating({
  className,
  averageRating,
}: {
  className?: string;
  averageRating: number;
}) {
  const t = useTranslations('destination');

  const rating = formatRating(averageRating);

  return (
    <span
      className={cn('text-2xl font-semibold', className)}
      aria-label={t('rating') + ': ' + rating}
    >
      {rating}
      <small className='mx-2 inline-flex self-end fill-secondary'>
        {Array(Math.floor(Number(rating)))
          .fill(0)
          .map((_, index) => (
            <StarFill key={`full-${index}`} className='size-5' />
          ))}
        {Number(rating) % 1 >= 0.5 && (
          <StarHalfFill key='half' className='size-5' />
        )}
        {Array(
          5 - Math.floor(Number(rating)) - (Number(rating) % 1 >= 0.5 ? 1 : 0),
        )
          .fill(0)
          .map((_, index) => (
            <Star key={`empty-${index}`} className='size-5' />
          ))}
      </small>
    </span>
  );
}

export { AverageRating };
