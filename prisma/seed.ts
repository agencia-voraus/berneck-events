const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const existingStock = await prisma.giftStock.findFirst();

  if (!existingStock) {
    await prisma.giftStock.create({
      data: {
        isActive: true,
        totalAvailable: 10000,
        redeemedCount: 0,
      },
    });

    console.log('🎉 GiftStock seed inserido com sucesso!');
  } else {
    console.log('⚠️ GiftStock já existe, não foi necessário inserir.');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });