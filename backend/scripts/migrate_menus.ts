import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.menu.update({
    where: { slug: 'deals' },
    data: { name: 'Main Navigation', slug: 'main-nav', description: 'Storefront Header Navigation' }
  });
  await prisma.menu.delete({
    where: { slug: 'about-us' }
  });
  console.log("Migrated Deals to main-nav and deleted empty about-us container");
}

main().catch(console.error).finally(() => prisma.$disconnect());
