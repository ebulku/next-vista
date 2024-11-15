// This file contains placeholder data that you'll be replacing with real data in the Data Fetching chapter:

import { InvoiceStatus } from '@prisma/client'

// https://nextjs.org/learn/dashboard-app/fetching-data
const users = [
  {
    name: 'User',
    email: 'user@nextmail.com',
    password: '123456',
  },
]

const orders = [
  {
    id: 'cm3ixzycs00000ckzhzzr6tfe',
    customerId: 'd6e15727-9fe1-4961-8c5b-ea44a9bd81aa',
    amount: 15795,
  },
]

const revenue = [
  { month: 'Jan', revenue: 2000 },
  { month: 'Feb', revenue: 1800 },
  { month: 'Mar', revenue: 2200 },
  { month: 'Apr', revenue: 2500 },
  { month: 'May', revenue: 2300 },
  { month: 'Jun', revenue: 3200 },
  { month: 'Jul', revenue: 3500 },
  { month: 'Aug', revenue: 3700 },
  { month: 'Sep', revenue: 2500 },
  { month: 'Oct', revenue: 2800 },
  { month: 'Nov', revenue: 3000 },
  { month: 'Dec', revenue: 4800 },
]

export { users, revenue }
