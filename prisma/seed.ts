import bcrypt from "bcrypt";
import {
  customers,
  invoices,
  revenue,
  users,
} from "../app/lib/placeholder-data";
import prisma from "../app/lib/prisma";

const seedUsers = async () => {
  const hashedUsers = await Promise.all(
    users.map(async (user) => ({
      ...user,
      password: await bcrypt.hash(user.password, 10),
    }))
  );

  return prisma.user.createMany({
    data: hashedUsers,
    skipDuplicates: true,
  });
};

const seedCustomers = prisma.customer.createMany({
  data: customers,
  skipDuplicates: true,
});

const seedInvoices = prisma.invoice.createMany({
  data: invoices,
  skipDuplicates: true,
});

const seedRevenue = prisma.revenue.createMany({
  data: revenue,
  skipDuplicates: true,
});

async function main() {
  try {
    await prisma.$transaction(seedUsers);
    await prisma.$transaction([seedCustomers, seedInvoices, seedRevenue]);
    console.log("Database seeded successfully");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
