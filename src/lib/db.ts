import { env } from '@/env';
import postgres, { type Sql } from 'postgres';

let sql: Sql | undefined;

function getSql() {
  if (!sql) {
    sql = postgres({
      host: env.DATABASE_HOST,
      port: Number(env.DATABASE_PORT),
      database: env.DATABASE_NAME,
      username: env.DATABASE_USER,
      password: env.DATABASE_PASSWORD,
      transform: postgres.toCamel,
    });
  }

  return sql;
}

type Role = 'user' | 'admin';

type User = {
  id: number;
  name?: string;
  email?: string;
  image?: string;
  role: Role;
  bio?: string;
  createdAt: Date;
};

type WorldRegion =
  | 'africa'
  | 'asia'
  | 'europe'
  | 'northAmerica'
  | 'oceania'
  | 'southAmerica';

type Destination = {
  id: number;
  userId: number;
  name: string;
  content: string;
  exclusiveContent: string;
  location: string;
  worldRegion: WorldRegion;
  images: string[];
  createdAt: Date;
  modifiedAt: Date;
  views: number;
};

type Review = {
  userId: number;
  destinationId: number;
  rating: number;
  comment?: string;
  image?: string;
  createdAt: Date;
  modifiedAt: Date | null;
};

type Keyword = {
  id: number;
  name: string;
};

type WeatherData = {
  coord: {
    lon: number;
    lat: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  base: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
    sea_level: number;
    grnd_level: number;
  };
  visibility: number;
  wind: {
    speed: number;
    deg: number;
    gust: number;
  };
  rain?: {
    '1h': number;
  };
  snow?: {
    '1h': number;
  };
  clouds: {
    all: number;
  };
  dt: number;
  sys: {
    type: number;
    id: number;
    message?: number;
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  id: number;
  name: string;
  cod: number;
};

type WeatherCache = {
  destinationId: number;
  weatherData: string;
  createdAt: Date;
};

export {
  getSql as sql,
  type User,
  type Destination,
  type Review,
  type Keyword,
  type WeatherData,
  type WeatherCache,
};
