const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

const ADMIN_EMAIL = 'admin@berneck.com.br';
const ADMIN_NAME = 'admin';
const ADMIN_PASSWORD = 'berneck@2026';

async function main() {
  const existingUser = await prisma.user.findUnique({
    where: { email: ADMIN_EMAIL },
  });

  if (existingUser) {
    console.log('⚠️ Usuário admin já existe com o email', ADMIN_EMAIL);
    return;
  }

  const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

  await prisma.user.create({
    data: {
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      passwordHash: hashedPassword,
      role: 'ADMIN',
    },
  });

  console.log('✅ Usuário admin criado com sucesso!');
  console.log('   Email:', ADMIN_EMAIL);
  console.log('   Nome:', ADMIN_NAME);
  console.log('   Role: ADMIN');
}

main()
  .catch((e) => {
    console.error('Erro ao criar usuário admin:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
