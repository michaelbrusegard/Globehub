import { getSql } from '@/lib/db';

const sql = getSql();

async function toggleUserRole(email: string) {
  const [user]: { role: string }[] = await sql`
        SELECT role
        FROM users
        WHERE email = ${email}
    `;

  const newRole = user?.role === 'admin' ? 'user' : 'admin';

  await sql`
        UPDATE users
        SET role = ${newRole}
        WHERE email = ${email}
    `;

  console.log(`Role updated to ${newRole}`);
}

const email = process.argv[2];
if (!email) {
  console.log('Please provide an email as a command-line argument');
  process.exit(1);
}

toggleUserRole(email)
  .catch(console.error)
  .finally(() => process.exit());
