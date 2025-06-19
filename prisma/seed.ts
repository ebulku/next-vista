import prisma from '../lib/prisma'
import { faker } from '@faker-js/faker'
import bcrypt from 'bcryptjs'

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

const seedProducts = async () => {
  const fakerProducts = Array.from({ length: 10 }).map(() => ({
    product_id: faker.number.int(),
    name: faker.commerce.productName(),
    url: faker.internet.url(),
    status_id: faker.number.int({ min: 1, max: 2 }),
    price: faker.finance.amount({ min: 5, max: 10, dec: 2, symbol: '$' }),
  }))

  return prisma.product.createMany({
    data: fakerProducts,
    skipDuplicates: true,
  })
}

const seedSellers = async () => {
  const fakerSellers = Array.from({ length: 10 }).map(() => ({
    seller_id: faker.number.int(),
    name: faker.company.name(),
    phone: faker.phone.number(),
    address: faker.location.streetAddress(),
    url: faker.internet.url(),
  }))

  return prisma.seller.createMany({
    data: fakerSellers,
    skipDuplicates: true,
  })
}

const seedSellersProducts = async () => {
  const productIds = await prisma.product.findMany({
    select: {
      product_id: true,
    },
  })

  const sellerIds = await prisma.seller.findMany({
    select: {
      seller_id: true,
    },
  })

  const fakerSellersProducts = Array.from({ length: 10 }).map(() => ({
    product_id: faker.helpers.arrayElement(productIds).product_id,
    seller_id: faker.helpers.arrayElement(sellerIds).seller_id,
  }))

  return prisma.productSellers.createMany({
    data: fakerSellersProducts,
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
    await seedProducts()
    await seedSellers()
    await seedSellersProducts()
    console.log('Database seeded successfully')
  } catch (error) {
    console.error('Error seeding database:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Call the main seeder
main()
