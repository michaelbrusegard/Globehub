import StarFill from '@material-symbols/svg-400/outlined/star-fill.svg';
import Star from '@material-symbols/svg-400/outlined/star.svg';
import StarHalfFill from '@material-symbols/svg-400/outlined/star_half-fill.svg';
import { useState } from 'react';

import { cn } from '@/lib/utils';

type AddRatingProps = {
  setRating: (rating: number) => void;
  rating: number;
  handleBlur: () => void;
  isInvalid: boolean;
  errorMessage: string | false | undefined;
};

function AddRating({
  setRating,
  rating,
  handleBlur,
  isInvalid,
  errorMessage,
}: AddRatingProps) {
  const [hover, setHover] = useState(0);
  const [focus, setFocus] = useState(0);

  const handleKeyDown = (event: React.KeyboardEvent, starIndex: number) => {
    if (event.key === 'Enter' || event.key === ' ') {
      setRating(starIndex);
    }
  };

  return (
    <div className='flex gap-2'>
      <div
        className={cn(
          'relative inline-flex rounded-md',
          isInvalid && 'bg-danger-50',
        )}
        aria-describedby={isInvalid ? 'image-files-error' : undefined}
        aria-invalid={isInvalid}
        aria-valuenow={rating}
        aria-valuemin={0}
        aria-valuemax={10}
      >
        {[...Array<undefined>(10)].map((_, index) => {
          const starIndex = index + 1;
          return (
            <>
              <div
                className='h-6 w-3 cursor-pointer outline-none'
                key={index}
                role='button'
                tabIndex={0}
                onMouseEnter={() => setHover(starIndex)}
                onMouseLeave={() => setHover(0)}
                onClick={() => setRating(starIndex)}
                onKeyDown={(event) => handleKeyDown(event, starIndex)}
                onMouseDown={(event) => event.preventDefault()}
                onFocus={() => setFocus(starIndex)}
                onBlur={() => {
                  setFocus(0);
                  handleBlur();
                }}
              />
            </>
          );
        })}
        <div className='pointer-events-none absolute inline-flex fill-warning'>
          {[...Array<undefined>(10)].map((_, index) => {
            const starIndex = index + 1;
            return (
              <>
                {starIndex % 2 === 0 &&
                  (starIndex <= (focus || hover || rating) ? (
                    <StarFill
                      className={cn(
                        'size-6 rounded-md',
                        starIndex === hover && 'bg-default-100',
                        starIndex === focus &&
                          'z-10 ring-2 ring-focus ring-offset-2 ring-offset-default-50',
                      )}
                      aria-hidden='true'
                    />
                  ) : starIndex === (focus || hover || rating) + 1 ? (
                    <StarHalfFill
                      className={cn(
                        'size-6 rounded-md',
                        starIndex - 1 === hover && 'bg-default-100',
                        starIndex - 1 === focus &&
                          'z-10 ring-2 ring-focus ring-offset-2 ring-offset-default-50',
                      )}
                      aria-hidden='true'
                    />
                  ) : (
                    <Star className='size-6 rounded-md' aria-hidden='true' />
                  ))}
              </>
            );
          })}
        </div>
      </div>
      {isInvalid && (
        <div id='rating-error' className='mt-1 self-end text-tiny text-danger'>
          {errorMessage}
        </div>
      )}
    </div>
  );
}

export { AddRating };
