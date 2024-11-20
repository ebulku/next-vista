import prisma from '@/lib/prisma'
import { formatCurrency } from '@/lib/utils'

export async function fetchRevenue() {
  const feed = await prisma.revenue.findMany()
  return feed
}

export async function fetchLatestInvoices() {
  const feed = await prisma.invoice.findMany({
    take: 5,
    include: {
      customer: {
        select: {
          name: true,
          imageUrl: true,
          email: true,
        },
      },
    },
  })
  return feed
}

export async function fetchCardData() {
  try {
    const [
      numberOfOrders,
      numberOfInvoices,
      paidInvoiceSum,
      pendingInvoiceSum,
    ] = await Promise.all([
      prisma.order.count(),
      prisma.invoice.count(),
      prisma.invoice.aggregate({
        _sum: { amount: true },
        where: { status: 'paid' },
      }),
      prisma.invoice.aggregate({
        _sum: { amount: true },
        where: { status: 'pending' },
      }),
    ])

    const totalPaidInvoices = formatCurrency(paidInvoiceSum._sum?.amount || 0)
    const totalPendingInvoices = formatCurrency(
      pendingInvoiceSum._sum?.amount || 0
    )

    return {
      numberOfOrders,
      numberOfInvoices,
      totalPaidInvoices,
      totalPendingInvoices,
    }
  } catch (error) {
    console.error('Database Error:', error)
    throw new Error('Failed to fetch card data.')
  }
}

const ITEMS_PER_PAGE = 10
export async function fetchFilteredInvoices(
  query: string,
  currentPage: number
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE
  const feed = await prisma.invoice.findMany({
    take: ITEMS_PER_PAGE,
    skip: offset,
    include: {
      customer: {
        select: {
          name: true,
          imageUrl: true,
          email: true,
        },
      },
    },
    where: {
      OR: [
        { customer: { name: { contains: query } } },
        { customer: { email: { contains: query } } },
      ],
    },
    orderBy: {
      date: 'desc',
    },
  })

  return feed
}

export async function fetchInvoicesPages(query: string) {
  // await new Promise((resolve) => setTimeout(resolve, 5000))
  const feed = await prisma.invoice.count({
    where: {
      OR: [
        { customer: { name: { contains: query } } },
        { customer: { email: { contains: query } } },
      ],
    },
  })

  return Math.ceil(feed / ITEMS_PER_PAGE)
}

export async function fetchInvoiceById(id: string) {
  try {
    const invoice = await prisma.invoice.findUnique({
      where: {
        id: id,
      },
    })

    if (!invoice) {
      return null
    }
    // Convert amount from cents to dollars
    return {
      ...invoice,
      amount: invoice.amount / 100,
    }
  } catch (error) {
    console.error('Database Error:', error)
    throw new Error('Failed to fetch invoice.')
  }
}

export async function fetchOrdersPages(query: string) {
  // await new Promise((resolve) => setTimeout(resolve, 5000))
  const feed = await prisma.order.count({
    where: {
      OR: [
        { customer: { name: { contains: query, mode: 'insensitive' } } },
        { customer: { email: { contains: query, mode: 'insensitive' } } },
        { title: { contains: query, mode: 'insensitive' } },
        { notes: { some: { body: { contains: query, mode: 'insensitive' } } } },
      ],
    },
  })

  return Math.ceil(feed / ITEMS_PER_PAGE)
}

export async function fetchFilteredOrders(query: string, currentPage: number) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE
  const feed = await prisma.order.findMany({
    take: ITEMS_PER_PAGE,
    skip: offset,
    include: {
      customer: {
        select: {
          name: true,
          imageUrl: true,
          email: true,
        },
      },
      notes: {
        take: 1,
        orderBy: {
          createdAt: 'desc',
        },
        select: {
          body: true,
        },
      },
    },
    where: {
      OR: [
        { customer: { name: { contains: query, mode: 'insensitive' } } },
        { customer: { email: { contains: query, mode: 'insensitive' } } },
        { title: { contains: query, mode: 'insensitive' } },
        { notes: { some: { body: { contains: query, mode: 'insensitive' } } } },
      ],
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return feed
}

export async function fetchOrderById(id: string) {
  try {
    const order = await prisma.order.findUnique({
      where: {
        id: id,
      },
      include: {
        customer: {
          select: {
            name: true,
            imageUrl: true,
            email: true,
          },
        },
      },
    })

    if (!order) {
      return null
    }
    // Convert amount from cents to dollars
    return {
      ...order,
      amount: order.amount ? order.amount / 100 : 0,
    }
  } catch (error) {
    console.error('Database Error:', error)
    throw new Error('Failed to fetch invoice.')
  }
}

export async function fetchLatestOrders() {
  const feed = await prisma.order.findMany({
    take: 5,
    include: {
      customer: {
        select: {
          name: true,
          imageUrl: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })
  return feed
}

export async function fetchCustomers() {
  const customers = await prisma.customer.findMany({
    orderBy: {
      name: 'asc',
    },
  })
  return customers
}

export async function fetchCustomerById(id: string) {
  try {
    const customer = await prisma.customer.findUnique({
      where: {
        id: id,
      },
    })

    if (!customer) {
      return null
    }

    return customer
  } catch (error) {
    console.error('Database Error:', error)
    throw new Error('Failed to fetch customer.')
  }
}

export async function fetchFilteredCustomers(query: string) {
  try {
    const customers = await prisma.customer.findMany({
      where: {
        OR: [
          {
            name: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            email: {
              contains: query,
              mode: 'insensitive',
            },
          },
        ],
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        description: true,
        imageUrl: true,
        invoices: {
          select: {
            status: true,
            amount: true,
          },
        },
        _count: {
          select: {
            orders: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    })

    const formattedCustomers = customers.map((customer) => {
      const totalPending = customer.invoices
        .filter((invoice) => invoice.status === 'pending')
        .reduce((sum, invoice) => sum + invoice.amount, 0)
      const totalPaid = customer.invoices
        .filter((invoice) => invoice.status === 'paid')
        .reduce((sum, invoice) => sum + invoice.amount, 0)

      return {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
        description: customer.description,
        imageUrl: customer.imageUrl,
        total_orders: customer._count.orders,
        total_invoices: customer.invoices.length,
        total_pending: formatCurrency(totalPending),
        total_paid: formatCurrency(totalPaid),
      }
    })

    return formattedCustomers
  } catch (err) {
    console.error('Database Error:', err)
    throw new Error('Failed to fetch customer table.')
  }
}

export async function fetchOrderNotes(id: string) {
  try {
    const notes = await prisma.note.findMany({
      where: {
        orderId: id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
    return notes
  } catch (err) {
    console.error('Database Error:', err)
    throw new Error('Failed to fetch order notes.')
  }
}

export async function fetchOrderFiles(id: string) {
  try {
    const files = await prisma.file.findMany({
      where: {
        orderId: id,
      },
    })
    return files
  } catch (err) {
    console.error('Database Error:', err)
    throw new Error('Failed to fetch order files.')
  }
}

export async function getFileUrlById(id: string) {
  try {
    const file = await prisma.file.findUnique({
      where: {
        id: id,
      },
    })

    return file?.url
  } catch (err) {
    console.error('Database Error:', err)
    throw new Error('Failed to fetch file.')
  }
}
