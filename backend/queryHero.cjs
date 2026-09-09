const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const slides = await prisma.heroSlide.findMany({ include: { image: true } });
  console.log(JSON.stringify(slides, null, 2));
  process.exit(0);
}
check();
