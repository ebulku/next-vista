// // This file contains type definitions for your data.
// // It describes the shape of the data, and what data type each property should accept.
// // For simplicity of teaching, we're manually defining these types.
// // However, these types are generated automatically if you're using an ORM such as Prisma.

export type LatestInvoice = {
  id: string
  name: string
  imageUrl: string | null
  email: string
  amount: string
}

// The database returns a number for amount, but we later format it to a string with the formatCurrency function
export type LatestInvoiceRaw = Omit<LatestInvoice, 'amount'> & {
  amount: number
}

export type InvoicesTable = {
  id: string
  customerId: string
  name: string
  email: string
  imageUrl: string | null
  date: string
  amount: number
  status: 'pending' | 'paid'
}

export type CustomersTableType = {
  id: string
  name: string
  email: string
  imageUrl: string | null
  total_invoices: number
  total_pending: number
  total_paid: number
}

export type FormattedCustomersTable = {
  id: string
  name: string
  email: string | null
  phone: string | null
  address: string | null
  description: string | null
  imageUrl: string | null
  total_orders: number
  total_invoices: number
  total_pending: string
  total_paid: string
}

export type CustomerField = {
  id: string
  name: string
}

export type InvoiceForm = {
  id: string
  customerId: string
  amount: number
  status: 'pending' | 'paid'
}

export type OrderForm = {
  id: string
  customerId: string | null
  amount: number | null
  title: string
  status: 'new' | 'production' | 'shipped' | 'paid'
}

export type ChartData = {
  name: string
  total: number
}
