import { sql } from '@/lib/db';

async function resetDatabase() {
  await sql`TRUNCATE TABLE verification_token CASCADE`;
  await sql`TRUNCATE TABLE accounts CASCADE`;
  await sql`TRUNCATE TABLE sessions CASCADE`;
  await sql`TRUNCATE TABLE users CASCADE`;
  await sql`TRUNCATE TABLE destinations CASCADE`;
  await sql`TRUNCATE TABLE reviews CASCADE`;
  await sql`TRUNCATE TABLE keywords CASCADE`;
  await sql`TRUNCATE TABLE destination_keywords CASCADE`;
  await sql`TRUNCATE TABLE user_favorites CASCADE`;

  console.log('Database reset completed!');
}

resetDatabase()
  .catch(console.error)
  .finally(() => process.exit());
