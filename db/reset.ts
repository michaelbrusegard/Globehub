import { getSql } from '@/lib/db';

const sql = getSql();

async function resetDatabase() {
  await sql`TRUNCATE TABLE verification_token RESTART IDENTITY CASCADE`;
  await sql`TRUNCATE TABLE accounts RESTART IDENTITY CASCADE`;
  await sql`TRUNCATE TABLE sessions RESTART IDENTITY CASCADE`;
  await sql`TRUNCATE TABLE users RESTART IDENTITY CASCADE`;
  await sql`TRUNCATE TABLE destinations RESTART IDENTITY CASCADE`;
  await sql`TRUNCATE TABLE reviews RESTART IDENTITY CASCADE`;
  await sql`TRUNCATE TABLE keywords RESTART IDENTITY CASCADE`;
  await sql`TRUNCATE TABLE destination_keywords RESTART IDENTITY CASCADE`;
  await sql`TRUNCATE TABLE user_favorites RESTART IDENTITY CASCADE`;

  console.log('Database reset completed!');
}

resetDatabase()
  .catch(console.error)
  .finally(() => process.exit());
