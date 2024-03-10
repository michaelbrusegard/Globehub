import ClearDay from '@material-symbols/svg-400/outlined/clear_day.svg';
import ClearNight from '@material-symbols/svg-400/outlined/clear_night.svg';
import Cloud from '@material-symbols/svg-400/outlined/cloud.svg';
import BrokenCloud from '@material-symbols/svg-400/outlined/filter_drama.svg';
import Foggy from '@material-symbols/svg-400/outlined/foggy.svg';
import PartlyCloudyDay from '@material-symbols/svg-400/outlined/partly_cloudy_day.svg';
import PartlyCloudyNight from '@material-symbols/svg-400/outlined/partly_cloudy_night.svg';
import Rainy from '@material-symbols/svg-400/outlined/rainy.svg';
import Thunderstorm from '@material-symbols/svg-400/outlined/thunderstorm.svg';
import WeatherSnowy from '@material-symbols/svg-400/outlined/weather_snowy.svg';

function WeatherIcon({
  icon,
  ...props
}: { icon: string } & React.SVGProps<SVGSVGElement>) {
  switch (icon) {
    case '01d':
      return <ClearDay {...props} />;
    case '01n':
      return <ClearNight {...props} />;
    case '02d':
      return <PartlyCloudyDay {...props} />;
    case '02n':
      return <PartlyCloudyNight {...props} />;
    case '03d':
      return <Cloud {...props} />;
    case '03n':
      return <Cloud {...props} />;
    case '04d':
      return <BrokenCloud {...props} />;
    case '04n':
      return <BrokenCloud {...props} />;
    case '09d':
      return <Rainy {...props} />;
    case '09n':
      return <Rainy {...props} />;
    case '10d':
      return <Rainy {...props} />;
    case '10n':
      return <Rainy {...props} />;
    case '11d':
      return <Thunderstorm {...props} />;
    case '11n':
      return <Thunderstorm {...props} />;
    case '13d':
      return <WeatherSnowy {...props} />;
    case '13n':
      return <WeatherSnowy {...props} />;
    case '50d':
      return <Foggy {...props} />;
    case '50n':
      return <Foggy {...props} />;
  }
}

export { WeatherIcon };
