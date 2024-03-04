import { env } from '@/env';

type WeatherProps = {
  locale: string;
  coordinates: [number, number];
};

async function Weather({ locale, coordinates }: WeatherProps) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${coordinates[0]}&lon=${coordinates[1]}&appid=${env.OPEN_WEATHER_API_KEY}&units=metric&lang=${locale}`;
  let data;
  try {
    const response = await fetch(url);
    // data = await response.json();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
  return (
    <div>
      <h2>Weather</h2>
      {/* <p>Code: {data.cod}</p>
      <p>Message: {data.message}</p> */}
    </div>
  );
}

export { Weather };
