'use server'

import { put } from '@vercel/blob'
import bcrypt from 'bcryptjs'
import fs from 'fs'
import { AuthError } from 'next-auth'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import path from 'path'
import { z } from 'zod'

import {
  ChangePasswordSchema,
  CreateCustomerSchema,
  CreateInvoiceSchema,
  CreateNoteSchema,
  CreateOrderSchema,
} from '@/lib/forms'
import prisma from '@/lib/prisma'
import { isImageType } from '@/lib/utils'

import { auth, signIn } from '@/auth'

export type State = {
  errors?: {
    customerId?: string[]
    amount?: string[]
    status?: string[]
  }
  message?: string | null
}

export type AddNoteState = {
  errors?: {
    body?: string[]
  }
  success: boolean
  message: string
}

export type CreateCustomerState = {
  errors?: {
    name?: string[]
    email?: string[]
    phone?: string[]
    address?: string[]
    description?: string[]
  }
  message: string
  success: boolean
}

export type ChangePasswordState = {
  message: string
  errors?: {
    currentPassword?: string[]
    newPassword?: string[]
    confirmPassword?: string[]
  }
  success: boolean
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
        id,
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
  let errorOccurred = false

  try {
    await signIn('credentials', formData)
  } catch (error) {
    if (error instanceof AuthError) {
      errorOccurred = true
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.'
        default:
          return 'Something went wrong.'
      }
    }
    throw error
  } finally {
    if (!errorOccurred) {
      redirect('/dashboard')
    }
  }
}

export async function createOrder(
  prevState: State,
  formData: z.infer<typeof CreateOrderSchema>
) {
  const validatedFields = CreateOrderSchema.safeParse({
    customerId: formData.customerId,
    amount: formData.amount,
    status: formData.status,
    title: formData.title,
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Order.',
    }
  }

  const { customerId, amount, status, title } = validatedFields.data
  const amountInCents = amount * 100

  let order

  try {
    order = await prisma.order.create({
      data: {
        customerId,
        title,
        amount: amountInCents,
        status,
      },
    })
  } catch (error) {
    return { message: 'Database Error: Failed to create Order.' }
  }

  if (order) {
    redirect(`/dashboard/orders/${order.id}`)
  } else {
    redirect('/dashboard/orders')
  }
}

export async function updateOrder(
  id: string,
  prevState: State,
  formData: z.infer<typeof CreateOrderSchema>
) {
  const validatedFields = CreateOrderSchema.safeParse({
    customerId: formData.customerId,
    amount: formData.amount,
    status: formData.status,
    title: formData.title,
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Order.',
    }
  }

  const { customerId, amount, status, title } = validatedFields.data
  const amountInCents = amount * 100

  try {
    await prisma.order.update({
      where: {
        id: id,
      },
      data: {
        customerId,
        amount: amountInCents,
        title,
        status,
      },
    })
  } catch (error) {
    return { message: 'Database Error: Failed to update order.' }
  }

  revalidatePath(`/dashboard/orders/${id}`)
  redirect(`/dashboard/orders/${id}`)

  return { message: 'Order Edited.' }
}

export async function deleteOrder(id: string) {
  console.log('Deleting order with id:', id)
  try {
    await prisma.order.delete({ where: { id: id } })
  } catch (error) {
    console.log(error)
    return { message: 'Database Error: Failed to delete order.' }
  }
  revalidatePath('/dashboard/orders')
}

export async function addNoteToOrder(
  orderId: string,
  prevState: AddNoteState,
  formData: z.infer<typeof CreateNoteSchema>
) {
  const validatedFields = CreateNoteSchema.safeParse({
    body: formData.body,
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      success: false,
      message: 'Missing Fields. Failed to Add Note.',
    }
  }

  const { body } = validatedFields.data

  try {
    await prisma.note.create({
      data: {
        orderId,
        body,
      },
    })

    revalidatePath(`/dashboard/orders/${orderId}`)

    return { success: true, message: 'Note Added.' }
  } catch (error) {
    return {
      success: false,
      message: 'Database Error: Failed to add note.',
    }
  }
}

export async function addFileToOrder(
  orderId: string,
  prevState: AddNoteState,
  files: File[]
) {
  try {
    const uploadPromises = files.map(async (file) => {
      const isImage = isImageType(file.type)
      const directory = isImage ? 'images' : 'docs'

      if (process.env.STORAGE === 'vercel_blob') {
        const blob = await put(`${directory}/${file.name}`, file, {
          access: 'public',
        })

        await prisma.file.create({
          data: { orderId, url: blob.url, type: file.type, name: file.name },
        })
      } else if (process.env.STORAGE === 'local') {
        const storageDir = path.join(process.cwd(), 'storage')
        const uploadDir = path.join(storageDir, directory)

        // Create directory if it doesn't exist
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true })
        }

        const fileName = `${Date.now()}-${file.name}`
        const filePath = path.join(uploadDir, fileName)

        // Write file to disk
        const bytes = await file.arrayBuffer()
        const uint8Array = new Uint8Array(bytes)
        fs.writeFileSync(filePath, uint8Array)

        // Save file info to database with storage path
        const storagePath = path.join('storage', directory, fileName)
        await prisma.file.create({
          data: {
            orderId,
            url: storagePath.replace(/\\/g, '/'), // Ensure consistent forward slashes
            type: file.type,
            name: file.name,
          },
        })
      }
    })

    await Promise.all(uploadPromises)

    revalidatePath(`/dashboard/orders/${orderId}`)
    return { message: `All files uploaded successfully`, success: true }
  } catch (error) {
    console.error('Error uploading files:', error)
    return {
      success: false,
      message: 'Database Error: Failed to add note.',
    }
  }
}

export async function createCustomer(
  prevState: CreateCustomerState,
  formData: z.infer<typeof CreateCustomerSchema>
) {
  const validatedFields = CreateCustomerSchema.safeParse({
    name: formData.name,
    email: formData.email,
    phone: formData.phone,
    address: formData.address,
    description: formData.description,
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Add Customer.',
      success: false,
    }
  }

  const { name, email, phone, address, description } = validatedFields.data

  try {
    await prisma.customer.create({
      data: {
        name,
        email,
        phone,
        address,
        description,
      },
    })

    revalidatePath('/')

    return { message: 'Customer Added.', success: true }
  } catch (error) {
    console.log(error)
    return {
      message: 'Database Error: Failed to add customer.',
      success: false,
    }
  }
}

export async function editCustomer(
  id: string,
  prevState: CreateCustomerState,
  formData: z.infer<typeof CreateCustomerSchema>
) {
  const validatedFields = CreateCustomerSchema.safeParse({
    name: formData.name,
    email: formData.email,
    phone: formData.phone,
    address: formData.address,
    description: formData.description,
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Edit Customer.',
      success: false,
    }
  }

  const { name, email, phone, address, description } = validatedFields.data

  try {
    await prisma.customer.update({
      where: {
        id,
      },
      data: {
        name,
        email,
        phone,
        address,
        description,
      },
    })
  } catch (error) {
    console.log(error)
    return {
      message: 'Database Error: Failed to edit customer.',
      success: false,
    }
  }

  revalidatePath(`/dashboard/customers/`)

  return { message: 'Customer Updated.', success: true }
}

export async function deleteCustomer(id: string) {
  try {
    await prisma.customer.delete({ where: { id: id } })
  } catch (error) {
    return { message: 'Database Error: Failed to delete customer.' }
  }
  revalidatePath('/dashboard/customers')
}

export async function changePassword(
  prevState: ChangePasswordState,
  formData: z.infer<typeof ChangePasswordSchema>
): Promise<ChangePasswordState> {
  if (process.env.NEXT_PUBLIC_ENVIRONMENT === 'demo') {
    return {
      message: 'Password changes are not allowed in demo.',
      success: true,
    }
  }

  try {
    // Get current user session
    const session = await auth()
    if (!session?.user?.email) {
      return {
        message: 'You must be logged in to change your password.',
        success: false,
      }
    }

    // Validate form data
    const validatedFields = ChangePasswordSchema.safeParse(formData)

    if (!validatedFields.success) {
      return {
        message: 'Invalid form data. Please check your input.',
        errors: validatedFields.error.flatten().fieldErrors,
        success: false,
      }
    }

    const { currentPassword, newPassword } = validatedFields.data

    // Get current user's password hash from database
    const user = await prisma.user.findFirst({
      where: {
        email: session.user.email,
      },
    })

    if (!user) {
      return {
        message: 'User not found.',
        success: false,
      }
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password)

    if (!isPasswordValid) {
      return {
        message: 'Current password is incorrect.',
        errors: {
          currentPassword: ['Current password is incorrect.'],
        },
        success: false,
      }
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    // Update password in database
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: hashedPassword,
      },
    })

    return {
      message: 'Password changed successfully.',
      success: true,
    }
  } catch (error) {
    console.error('Failed to change password:', error)
    return {
      message: 'An error occurred while changing your password.',
      success: false,
    }
  }
}
