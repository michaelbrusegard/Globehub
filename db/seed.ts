import { faker } from '@faker-js/faker';

import { sql } from '@/lib/db';

const SEED_RECORD_COUNT = 16;

async function seedUsers() {
  for (let i = 0; i < SEED_RECORD_COUNT; i++) {
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
  for (let i = 0; i < SEED_RECORD_COUNT; i++) {
    const name = faker.location.city();
    const userId = Math.ceil(Math.random() * SEED_RECORD_COUNT);
    const ingress = faker.lorem.sentence();
    const content = faker.lorem.paragraph();
    const exclusiveContent = faker.lorem.paragraph();
    const latitude = faker.location.latitude();
    const longitude = faker.location.longitude();
    const categories = [
      'city',
      'nature',
      'beach',
      'mountain',
      'landmark',
      'culture',
    ];
    const category = categories[Math.floor(Math.random() * categories.length)];
    const images = Array.from({ length: Math.ceil(Math.random() * 6) }, () =>
      faker.image.urlLoremFlickr({ category: category }),
    );

    await sql`
      INSERT INTO destinations ("userId", name, ingress, content, exclusive_content, location, images)
      VALUES (${userId}, ${name}, ${ingress}, ${content}, ${exclusiveContent}, POINT(${latitude}, ${longitude}), ARRAY[${images.join(',')}])
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
