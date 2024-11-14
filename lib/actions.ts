'use server'

import { signIn } from '@/auth'
import { AuthError } from 'next-auth'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import prisma from './prisma'
import { CreateInvoiceSchema } from './forms'
import { z } from 'zod'

// const InvoiceForm = CreateInvoiceSchema.omit({ id: true });

export type State = {
  errors?: {
    customerId?: string[]
    amount?: string[]
    status?: string[]
  }
  message?: string | null
}

export async function createInvoice(
  prevState: State,
  formData: z.infer<typeof CreateInvoiceSchema>
) {
  const validatedFields = CreateInvoiceSchema.safeParse({
    customerId: formData.customerId,
    amount: formData.amount,
    status: formData.status,
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Invoice.',
    }
  }

  const { customerId, amount, status } = validatedFields.data
  const amountInCents = amount * 100

  try {
    await prisma.invoice.create({
      data: {
        customerId,
        amount: amountInCents,
        status,
      },
    })
  } catch (error) {
    return { message: 'Database Error: Failed to create invoice.' }
  }

  // Test it out:
  revalidatePath('/dashboard/invoices')
  redirect('/dashboard/invoices')
}

export async function updateInvoice(
  id: string,
  prevState: State,
  formData: z.infer<typeof CreateInvoiceSchema>
) {
  const validatedFields = CreateInvoiceSchema.safeParse({
    customerId: formData.customerId,
    amount: formData.amount,
    status: formData.status,
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Invoice.',
    }
  }

  const { customerId, amount, status } = validatedFields.data
  const amountInCents = amount * 100

  try {
    await prisma.invoice.update({
      where: {
        id: id,
      },
      data: {
        customerId,
        amount: amountInCents,
        status,
      },
    })
  } catch (error) {
    return { message: 'Database Error: Failed to update invoice.' }
  }

  revalidatePath('/dashboard/invoices')
  redirect('/dashboard/invoices')
}

export async function deleteInvoice(id: string) {
  try {
    await prisma.invoice.delete({ where: { id: id } })
  } catch (error) {
    return { message: 'Database Error: Failed to delete invoice.' }
  }
  revalidatePath('/dashboard/invoices')
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    await signIn('credentials', formData)
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.'
        default:
          return 'Something went wrong.'
      }
    }
    throw error
  }
}
