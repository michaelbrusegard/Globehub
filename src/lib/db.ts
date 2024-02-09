import { env } from '@/env';
import postgres from 'postgres';

const sql = postgres(env.DATABASE_URL, { ssl: 'require' });

export { sql };
