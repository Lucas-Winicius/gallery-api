import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker/locale/en';

const prisma = new PrismaClient();

async function main() {
  try {
    await prisma.photo.createMany({
      data: Array(10)
        .fill(null)
        .map(() => ({
          name: faker.lorem.words({ min: 1, max: 7 }),
          description: faker.lorem.paragraph(),
          url: faker.internet.url(),
          tags: Array(3)
            .fill(null)
            .map(() => faker.lorem.word()),
        })),
    });

    console.log(`Seeded 10 photos`);
  } catch (error) {
    console.error(`Error seeding photos: ${error}`);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
