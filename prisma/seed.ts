import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from 'src/generated/prisma/client';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  const tags = [
    { title: 'Work', description: 'Tasks related to work' },
    { title: 'Personal', description: 'Personal tasks' },
    { title: 'Study', description: 'Learning and studying' },
    { title: 'Health', description: 'Exercise and health-related tasks' },
    { title: 'Urgent', description: 'High priority tasks' },
  ];

  await prisma.tag.createMany({
    data: tags,
    skipDuplicates: true,
  });

  console.log('✅ Seed tags done');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
