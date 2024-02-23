import { faker } from '@faker-js/faker';

import { sql } from '@/lib/db';

const SEED_RECORD_COUNT = 32;
const WORLD_REGION_KEYWORDS = [
  'Africa',
  'Asia',
  'Europe',
  'Oceania',
  'North America',
  'South America',
];
const KEYWORDS = [
  'City',
  'Nature',
  'Beach',
  'Mountain',
  'Landmark',
  'Culture',
  'Skyline',
];

function toCamelCase(str: string) {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word: string, index: number) {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/\s+/g, '');
}

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

async function seedKeywords() {
  const keywords = [...WORLD_REGION_KEYWORDS, ...KEYWORDS];
  for (const keyword of keywords) {
    await sql`
      INSERT INTO keywords (name)
      VALUES (${keyword})
    `;
  }
}

async function seedDestinations() {
  for (let i = 0; i < SEED_RECORD_COUNT; i++) {
    const name = faker.location.city();
    const userId = Math.ceil(Math.random() * SEED_RECORD_COUNT);
    const content = faker.lorem.paragraphs(5, '<br/>\n');
    const exclusiveContent = faker.lorem.paragraph();
    const latitude = faker.location.latitude();
    const longitude = faker.location.longitude();
    const regionKeyword =
      WORLD_REGION_KEYWORDS[
        Math.floor(Math.random() * WORLD_REGION_KEYWORDS.length)
      ];

    const otherKeywords = KEYWORDS.filter(() => Math.random() < 0.5).slice(
      0,
      3,
    );
    const category =
      toCamelCase(regionKeyword!) + ',' + toCamelCase(otherKeywords[0]!);
    const images = Array.from(
      { length: Math.floor(Math.random() * 8) + 3 },
      () => faker.image.urlLoremFlickr({ category: category }),
    );

    const imagesArrayString = `{${images.map((image) => `"${image.replace(/"/g, '""')}"`).join(',')}}`;

    const [destination]: Array<{ id: number }> = await sql`
        INSERT INTO destinations (user_id, name, content, exclusive_content, location, images)
        VALUES (${userId}, ${name}, ${content}, ${exclusiveContent}, POINT(${latitude}, ${longitude}), ${imagesArrayString})
        RETURNING id
      `;

    const destinationId = destination!.id;

    const allKeywords = [regionKeyword, ...otherKeywords];
    for (const keyword of allKeywords) {
      const [keywordRecord]: Array<{ id: number }> = await sql`
        SELECT id FROM keywords WHERE name = ${keyword!}
      `;

      if (keywordRecord) {
        const keywordId = keywordRecord.id;

        await sql`
          INSERT INTO destination_keywords (destination_id, keyword_id)
          VALUES (${destinationId}, ${keywordId})
        `;
      }
    }
  }
}

async function seedReviews() {
  const users = await sql`SELECT id FROM users`;
  const destinations = await sql`SELECT id FROM destinations`;

  for (const user of users) {
    for (const destination of destinations) {
      if (Math.random() < 0.5) {
        const rating = Math.floor(Math.random() * 10) + 1;
        const comment = faker.lorem.sentence();
        const image = faker.image.urlLoremFlickr({ category: 'date' });

        await sql`
          INSERT INTO reviews (user_id, destination_id, rating, comment, image)
          VALUES (${user.id}, ${destination.id}, ${rating}, ${comment}, ${image})
        `;
      }
    }
  }
}

async function seedUserFavorites() {
  const users = await sql`SELECT id FROM users`;
  const destinations = await sql`SELECT id FROM destinations`;

  for (const user of users) {
    for (const destination of destinations) {
      if (Math.random() < 0.1) {
        await sql`
          INSERT INTO user_favorites (user_id, destination_id)
          VALUES (${user.id}, ${destination.id})
        `;
      }
    }
  }
}

async function main() {
  await seedUsers();
  await seedKeywords();
  await seedDestinations();
  await seedReviews();
  await seedUserFavorites();
  console.log('Database seeding completed!');
}

main()
  .catch(console.error)
  .finally(() => process.exit());
