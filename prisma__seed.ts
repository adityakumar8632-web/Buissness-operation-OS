import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// The full permission vocabulary for the modules planned across all phases.
// Phase 0 only wires up "org:*" in the UI, but seeding the rest now means
// later phases just grant existing keys to roles instead of inventing them.
const PERMISSIONS = [
  "org:read",
  "org:manage",
  "customers:read",
  "customers:write",
  "deals:read",
  "deals:write",
  "orders:read",
  "orders:write",
  "inventory:read",
  "inventory:write",
  "suppliers:read",
  "suppliers:write",
  "tasks:read",
  "tasks:write",
  "finance:read",
  "finance:write",
  "reports:read",
  "audit:read",
];

// Which roles get which permissions, per the "who uses the system" table
// in the spec (Section 2).
const ROLE_PERMISSIONS: Record<string, string[]> = {
  owner: PERMISSIONS, // everything
  manager: [
    "org:read",
    "customers:read",
    "customers:write",
    "deals:read",
    "deals:write",
    "orders:read",
    "orders:write",
    "inventory:read",
    "suppliers:read",
    "tasks:read",
    "tasks:write",
    "reports:read",
    "audit:read",
  ],
  sales: ["org:read", "customers:read", "customers:write", "deals:read", "deals:write", "orders:read"],
  inventory: ["org:read", "inventory:read", "inventory:write", "suppliers:read", "suppliers:write"],
  employee: ["org:read", "tasks:read", "tasks:write"],
};

async function main() {
  // 1. Global permissions
  for (const key of PERMISSIONS) {
    await prisma.permission.upsert({
      where: { key },
      update: {},
      create: { key },
    });
  }

  // 2. Two organizations, so you can log in as each and confirm one
  // never sees the other's data.
  const orgsData = [
    { name: "Acme Retail Co", slug: "acme" },
    { name: "Northwind Traders", slug: "northwind" },
  ];

  for (const orgData of orgsData) {
    const org = await prisma.organization.upsert({
      where: { slug: orgData.slug },
      update: {},
      create: orgData,
    });

    for (const roleName of Object.keys(ROLE_PERMISSIONS)) {
      const role = await prisma.role.upsert({
        where: { organizationId_name: { organizationId: org.id, name: roleName } },
        update: {},
        create: { name: roleName, organizationId: org.id },
      });

      for (const permKey of ROLE_PERMISSIONS[roleName]) {
        const permission = await prisma.permission.findUniqueOrThrow({ where: { key: permKey } });
        await prisma.rolePermission.upsert({
          where: { roleId_permissionId: { roleId: role.id, permissionId: permission.id } },
          update: {},
          create: { roleId: role.id, permissionId: permission.id },
        });
      }
    }

    // One demo owner login per org.
    const ownerRole = await prisma.role.findUniqueOrThrow({
      where: { organizationId_name: { organizationId: org.id, name: "owner" } },
    });
    const email = `owner@${org.slug}.test`;
    const passwordHash = await bcrypt.hash("password123", 10);

    await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        email,
        passwordHash,
        name: `${org.name} Owner`,
        organizationId: org.id,
        roleId: ownerRole.id,
      },
    });

    console.log(`Seeded ${org.name} — login as ${email} / password123`);
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
