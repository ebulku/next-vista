import { faker } from '@faker-js/faker'
import bcrypt from 'bcrypt'

import prisma from '@/lib/prisma'

import { revenue, users } from './data'

// User Seeder
const seedUsers = async () => {
  const hashedUsers = await Promise.all(
    users.map(async (user) => ({
      ...user,
      password: await bcrypt.hash(user.password, 10),
    }))
  )

  return prisma.user.createMany({
    data: hashedUsers,
    skipDuplicates: true,
  })
}

// Customer Seeder
const seedCustomers = async () => {
  const fakerCustomers = Array.from({ length: 10 }).map(() => ({
    name: faker.person.fullName(),
    email: faker.internet.email(),
    imageUrl: faker.image.avatar(),
  }))

  return prisma.customer.createMany({
    data: fakerCustomers,
    skipDuplicates: true,
  })
}

// Invoice Seeder
const seedInvoices = async () => {
  const customersCount = await prisma.customer.count()

  const fakerInvoices = await Promise.all(
    Array.from({ length: 50 }).map(async () => {
      const randomCustomer = await prisma.customer.findMany({
        take: 1,
        skip: Math.floor(Math.random() * customersCount),
      })

      return {
        customerId: randomCustomer[0].id,
        date: faker.date.between({
          from: new Date('2024-01-01'),
          to: new Date(),
        }),
        amount: faker.number.int({ min: 100, max: 1000000 }),
        status: faker.helpers.arrayElement(['pending', 'paid']),
      }
    })
  )

  return prisma.invoice.createMany({
    data: fakerInvoices,
    skipDuplicates: true,
  })
}

// Revenue Seeder
const seedRevenue = async () => {
  return prisma.revenue.createMany({
    data: revenue,
    skipDuplicates: true,
  })
}

const seedOrders = async () => {
  const customersCount = await prisma.customer.count()

  const fakerOrders = await Promise.all(
    Array.from({ length: 10 }).map(async () => {
      const randomCustomer = await prisma.customer.findMany({
        take: 1,
        skip: Math.floor(Math.random() * customersCount),
      })

      return {
        customerId: randomCustomer[0].id,
        title: faker.commerce.productName(),
        amount: faker.number.int({ min: 100, max: 1000000 }),
        status: faker.helpers.arrayElement([
          'new',
          'production',
          'shipped',
          'paid',
        ]),
        createdAt: faker.date.between({
          from: new Date('2024-01-01'),
          to: new Date(),
        }),
      }
    })
  )

  return prisma.order.createMany({
    data: fakerOrders,
    skipDuplicates: true,
  })
}

const seedNotes = async () => {
  const ordersCount = await prisma.order.count()

  const fakerNotes = await Promise.all(
    Array.from({ length: 100 }).map(async () => {
      const randomOrder = await prisma.order.findMany({
        take: 1,
        skip: Math.floor(Math.random() * ordersCount),
      })

      return {
        orderId: randomOrder[0].id,
        body: faker.lorem.paragraph(),
        createdAt: faker.date.between({
          from: new Date('2024-01-01'),
          to: new Date(),
        }),
      }
    })
  )

  return prisma.note.createMany({
    data: fakerNotes,
    skipDuplicates: true,
  })
}

const seedFiles = async () => {
  const ordersCount = await prisma.order.count()

  const fakerFiles = await Promise.all(
    Array.from({ length: 50 }).map(async () => {
      const randomOrder = await prisma.order.findMany({
        take: 1,
        skip: Math.floor(Math.random() * ordersCount),
      })

      return {
        orderId: randomOrder[0].id,
        url: faker.image.url(),
        createdAt: faker.date.between({
          from: new Date('2024-01-01'),
          to: new Date(),
        }),
      }
    })
  )

  return prisma.file.createMany({
    data: fakerFiles,
    skipDuplicates: true,
  })
}

// Main Seeder Function
async function main() {
  try {
    await seedUsers()
    await seedCustomers()
    await seedInvoices()
    await seedRevenue()
    await seedOrders()
    await seedNotes()
    await seedFiles()
    console.log('Database seeded successfully')
  } catch (error) {
    console.error('Error seeding database:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Call the main seeder
main()
