import { z } from 'zod'

export const CreateInvoiceSchema = z.object({
  // id: z.string(),
  customerId: z.string({
    invalid_type_error: 'Please select a valid Customer',
  }),
  amount: z.coerce
    .number()
    .gt(0, { message: 'Please enter an amount greater than $0.' }),
  status: z.enum(['pending', 'paid'], {
    invalid_type_error: 'Please select a valid Status',
  }),
})
