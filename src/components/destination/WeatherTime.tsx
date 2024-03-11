'use client';

import WaterLux from '@material-symbols/svg-400/outlined/water_lux.svg';
import WBTvilight from '@material-symbols/svg-400/outlined/wb_twilight.svg';
import { useFormatter, useNow } from 'next-intl';

function DaylightTimes({
  sunrise,
  sunset,
}: {
  sunrise: number;
  sunset: number;
}) {
  const format = useFormatter();
  const now = useNow({
    updateInterval: 1000 * 60,
  });
  return (
    <>
      <div className='text-default-500'>
        <WaterLux
          className='mr-2 inline size-5 fill-foreground'
          aria-hidden='true'
        />
        <time dateTime={new Date(sunrise * 1000).toISOString()}>
          {format.relativeTime(new Date(sunrise * 1000), now)}
        </time>
      </div>
      <div className='text-default-500'>
        <WBTvilight
          className='mr-2 inline size-5 fill-foreground'
          aria-hidden='true'
        />
        <time dateTime={new Date(sunset * 1000).toISOString()}>
          {format.relativeTime(new Date(sunset * 1000), now)}
        </time>
      </div>
    </>
  );
}

function UpdateTime({ createdAt }: { createdAt: Date }) {
  const format = useFormatter();
  const now = useNow({
    updateInterval: 1000,
  });
  return (
    <time dateTime={createdAt.toISOString()}>
      {format.relativeTime(createdAt, now)}
    </time>
  );
}

export { DaylightTimes, UpdateTime };
