import Schedule from '@material-symbols/svg-400/outlined/schedule.svg';
import SortByAlpha from '@material-symbols/svg-400/outlined/sort_by_alpha.svg';
import Star from '@material-symbols/svg-400/outlined/star.svg';
import Visibility from '@material-symbols/svg-400/outlined/visibility.svg';

function OrderIcon({
  icon,
  ...props
}: { icon: string } & React.SVGProps<SVGSVGElement>) {
  switch (icon) {
    case 'rating':
      return <Star {...props} />;
    case 'alphabetic':
      return <SortByAlpha {...props} />;
    case 'newest':
      return <Schedule {...props} />;
    case 'views':
      return <Visibility {...props} />;
  }
}

export { OrderIcon };
