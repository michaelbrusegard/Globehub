import { env } from '@/env';
import postgres from 'postgres';

const sql = postgres({
  host: env.DATABASE_HOST,
  port: env.DATABASE_PORT,
  database: env.DATABASE_NAME,
  username: env.DATABASE_USER,
  password: env.DATABASE_PASSWORD,
});

type User = {
  id: number;
  name?: string;
  email?: string;
  emailVerified?: Date;
  image?: string;
  role: string;
  bio?: string;
  createdAt: Date;
};

type Destination = {
  id: number;
  name: string;
  description?: string;
  location: string;
  images?: string[];
};

type Review = {
  userId: number;
  destinationId: number;
  rating: number;
  comment?: string;
  image?: string;
};

type Keyword = {
  id: number;
  name: string;
};

export { sql, type User, type Destination, type Review, type Keyword };
