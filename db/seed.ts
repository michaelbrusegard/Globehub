import { faker } from '@faker-js/faker';

import { sql } from '@/lib/db';

async function seedUsers() {
  for (let i = 0; i < 10; i++) {
    const name = faker.person.fullName();
    const email = faker.internet.email();
    const image = faker.image.avatar();
    const bio = faker.lorem.paragraph(1);

    await sql`
      INSERT INTO users (name, email, image, bio)
      VALUES (${name}, ${email}, ${image}, ${bio})
    `;
  }
}

async function seedDestinations() {
  for (let i = 0; i < 10; i++) {
    const name = faker.location.city();
    const description = faker.lorem.paragraph();
    const latitude = faker.location.latitude();
    const longitude = faker.location.longitude();
    const images = Array.from({ length: Math.ceil(Math.random() * 5) }, () =>
      faker.image.urlPicsumPhotos(),
    );

    await sql`
      INSERT INTO destinations (name, description, location, images)
      VALUES (${name}, ${description}, POINT(${latitude}, ${longitude}), ARRAY[${images.join(',')}])
    `;
  }
}

async function main() {
  await seedUsers();
  await seedDestinations();
  console.log('Database seeding completed!');
}

main()
  .catch(console.error)
  .finally(() => process.exit());
