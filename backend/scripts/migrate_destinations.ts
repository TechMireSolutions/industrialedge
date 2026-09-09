import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Migrating custom destinationType to internal...');
  
  const result = await prisma.menuItem.updateMany({
    where: { destinationType: 'custom' },
    data: { destinationType: 'internal' }
  });

  console.log(`Migrated ${result.count} records.`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
