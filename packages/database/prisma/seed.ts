import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create base organization
  const org = await prisma.organization.create({
    data: {
      name: 'Acme Corporation (Demo)',
    },
  });

  // Create admin user
  await prisma.user.create({
    data: {
      email: 'admin@acme.test',
      hashedPassword: 'hashed_password_placeholder', // In real app, use bcrypt hash
      firstName: 'Admin',
      lastName: 'User',
      role: Role.ADMIN,
      organizationId: org.id,
    },
  });

  // Create sample catalog
  await prisma.product.create({
    data: {
      skuCode: 'SRV-001',
      name: 'Enterprise Server Rack',
      description: '42U Standard Server Rack',
      price: 1200.00,
    },
  });

  console.log('Database seeding completed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });