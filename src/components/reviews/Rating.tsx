import StarFill from '@material-symbols/svg-400/outlined/star-fill.svg';
import Star from '@material-symbols/svg-400/outlined/star.svg';
import StarHalfFill from '@material-symbols/svg-400/outlined/star_half-fill.svg';

function Rating({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating / 2);
  const halfStars = rating % 2;
  const emptyStars = 5 - fullStars - halfStars;

  return (
    <small className='inline-flex fill-warning'>
      {Array(fullStars)
        .fill(0)
        .map((_, index) => (
          <StarFill key={`full-${index}`} className='size-5' />
        ))}
      {halfStars > 0 && <StarHalfFill key='half' className='size-5' />}
      {Array(emptyStars)
        .fill(0)
        .map((_, index) => (
          <Star key={`empty-${index}`} className='size-5' />
        ))}
    </small>
  );
}

export { Rating };
