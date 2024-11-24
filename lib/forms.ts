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

export const CreateOrderSchema = z.object({
  // id: z.string(),
  customerId: z
    .string({
      invalid_type_error: 'Please select a valid Customer',
    })
    .optional(),
  amount: z.coerce.number({
    invalid_type_error: 'Please enter a valid amount',
  }),
  status: z.enum(['new', 'production', 'shipped', 'paid'], {
    invalid_type_error: 'Please select a valid Status',
  }),
  title: z.string({
    invalid_type_error: 'Please enter a valid title',
  }),
})

export const CreateNoteSchema = z.object({
  body: z.string({
    invalid_type_error: 'Please enter a valid Note',
  }),
})

export const CreateCustomerSchema = z.object({
  name: z.string({
    invalid_type_error: 'Please enter a valid name',
  }),
  email: z
    .string({
      invalid_type_error: 'Please enter a valid email',
    })
    .email()
    .optional(),
  phone: z
    .string({
      invalid_type_error: 'Please enter a valid phone number',
    })
    .optional(),
  address: z
    .string({
      invalid_type_error: 'Please enter a valid address',
    })
    .optional(),
  description: z
    .string({
      invalid_type_error: 'Please enter a valid description',
    })
    .optional(),
})

export const ChangePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your new password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })
