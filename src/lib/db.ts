import { env } from '@/env';
import postgres from 'postgres';

const sql = postgres({
  host: env.DATABASE_HOST,
  port: env.DATABASE_PORT,
  database: env.DATABASE_NAME,
  username: env.DATABASE_USER,
  password: env.DATABASE_PASSWORD,
});

export { sql };
