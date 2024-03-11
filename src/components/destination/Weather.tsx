import { env } from '@/env';
import AcUnit from '@material-symbols/svg-400/outlined/ac_unit.svg';
import Air from '@material-symbols/svg-400/outlined/air.svg';
import Humidity from '@material-symbols/svg-400/outlined/humidity_percentage.svg';
import Mist from '@material-symbols/svg-400/outlined/mist.svg';
import NestFarsightWeather from '@material-symbols/svg-400/outlined/nest_farsight_weather.svg';
import South from '@material-symbols/svg-400/outlined/south.svg';
import Thermostat from '@material-symbols/svg-400/outlined/thermostat.svg';
import Umbrella from '@material-symbols/svg-400/outlined/umbrella.svg';
import { getTranslations } from 'next-intl/server';

import { type WeatherCache, type WeatherData, sql } from '@/lib/db';

import { WeatherIcon } from '@/components/destination/WeatherIcon';
import {
  DaylightTimes,
  UpdateTime,
} from '@/components/destination/WeatherTime';

type WeatherProps = {
  locale: string;
  location: string;
  destinationId: number;
};

function getWindDirection(deg: number) {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(((deg %= 360) < 0 ? deg + 360 : deg) / 45) % 8;
  return directions[index];
}

async function Weather({ locale, location, destinationId }: WeatherProps) {
  const t = await getTranslations('destination.weather');
  const coordinates = location.slice(1, -1).split(',');
  const [longitude, latitude] = coordinates;
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${env.OPEN_WEATHER_API_KEY}&units=metric&lang=${locale}`;

  let [weather]: WeatherCache[] = await sql`
    SELECT * FROM weather_caches WHERE destination_id = ${destinationId} AND created_at > NOW() - INTERVAL '1 hour'
  `;

  if (!weather) {
    try {
      const response = await fetch(url);
      const data: WeatherData = (await response.json()) as WeatherData;

      [weather] = await sql`
        INSERT INTO weather_caches (destination_id, weather_data, created_at) 
        VALUES (${destinationId}, ${JSON.stringify(data)}, NOW()) 
        ON CONFLICT (destination_id) DO UPDATE 
        SET weather_data = ${JSON.stringify(data)}, created_at = NOW()
        RETURNING *
      `;
    } catch (error) {
      [weather] =
        await sql`SELECT * FROM weather_caches WHERE destination_id = ${destinationId}`;
    }
  }

  if (!weather)
    return (
      <span className='italic text-default-500'>
        {t('weatherNotAvailable')}
      </span>
    );

  const data = JSON.parse(weather.weatherData) as WeatherData;

  return (
    <>
      <div className='mb-4 flex flex-col justify-around gap-6 text-default-500 sm:flex-row'>
        <div>
          <span className='flex items-center gap-1 text-3xl font-semibold text-secondary'>
            <WeatherIcon
              className='inline size-10 fill-foreground'
              icon={data.weather[0]!.icon}
              aria-hidden='true'
            />
            {Math.round(data.main.temp)}°
          </span>
          <span className='mb-4 block'>
            {data.weather[0]!.description.charAt(0).toUpperCase() +
              data.weather[0]!.description.slice(1)}
          </span>
          <DaylightTimes sunrise={data.sys.sunrise} sunset={data.sys.sunset} />
        </div>
        <div className='space-y-2'>
          <ul>
            <li>
              <Thermostat
                className='mr-2 inline size-5 fill-foreground'
                aria-hidden='true'
              />
              {t('feelsLike')}{' '}
              <span className='text-primary-600'>
                {Math.round(data.main.feels_like)}°
              </span>
            </li>
            <li>
              <Humidity
                className='mr-2 inline size-5 fill-foreground'
                aria-hidden='true'
              />
              <span className='text-primary-600'>{data.main.humidity}%</span>{' '}
              {t('humidity')}
            </li>
            {data.rain && (
              <li>
                <Umbrella
                  className='mr-2 inline size-5 fill-foreground'
                  aria-hidden='true'
                />
                <span className='text-primary-600'>
                  {Math.round(data.rain['1h'])}
                </span>{' '}
                {t('milimetersRainfall')}
              </li>
            )}
            {data.snow && (
              <li>
                <AcUnit
                  className='mr-2 inline size-5 fill-foreground'
                  aria-hidden='true'
                />
                <span className='text-primary-600'>
                  {Math.round(data.snow['1h'])}
                </span>{' '}
                {t('milimetersSnowfall')}
              </li>
            )}
          </ul>
          <ul>
            <li>
              <Air
                className='mr-2 inline size-5 fill-foreground'
                aria-hidden='true'
              />
              <span className='text-warning-600'>
                {Math.round(data.wind.speed)}
              </span>{' '}
              {t('metersPerSecond')}
            </li>
            <li>
              <South
                className='mr-2 inline size-5 fill-foreground'
                aria-hidden='true'
                style={{
                  transform: `rotate(${data.wind.deg}deg)`,
                }}
              />
              <span className='text-warning-600'>
                {Math.round(data.wind.deg)}°
              </span>{' '}
              {t('windDirection', {
                direction: getWindDirection(data.wind.deg),
              })}
            </li>
          </ul>
          <ul>
            <li>
              <NestFarsightWeather
                className='mr-2 inline size-5 fill-foreground'
                aria-hidden='true'
              />
              <span className='text-primary-600'>{data.clouds.all}%</span>{' '}
              {t('cloudCoverage')}
            </li>
            <li>
              <Mist
                className='mr-2 inline size-5 fill-foreground'
                aria-hidden='true'
              />
              <span className='text-primary-600'>
                {data.visibility > 1000
                  ? Math.round(data.visibility / 1000) + ' km'
                  : data.visibility + ' m'}
              </span>{' '}
              {t('visibility')}
            </li>
          </ul>
        </div>
      </div>
      <span className='italic'>
        {t('updated')} <UpdateTime createdAt={weather.createdAt} />
      </span>
    </>
  );
}

export { Weather };
