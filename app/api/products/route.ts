import prisma from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// Validation schemas
const productIdsSchema = z.object({
  product_ids: z
    .array(z.union([z.string(), z.number()]))
    .min(1, 'At least one product_id is required'),
})

const createProductSchema = z.object({
  product_id: z.union([z.string(), z.number()]).transform((val) => BigInt(val)),
  name: z.string().min(1, 'Product name is required'),
  url: z.string().url().optional().nullable(),
  status_id: z.number().int().positive('Status ID must be a positive integer'),
  price: z.string().optional().nullable(),
  sellers: z
    .array(z.union([z.string(), z.number()]))
    .optional()
    .default([]),
})

// GET: Check which product_ids exist
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const productIdsParam = searchParams.get('product_ids')

    if (!productIdsParam) {
      return NextResponse.json(
        { error: 'product_ids parameter is required' },
        { status: 400 }
      )
    }

    // Parse the comma-separated product_ids
    let productIds: (string | number)[]
    try {
      // Handle both comma-separated string and JSON array
      if (productIdsParam.startsWith('[')) {
        productIds = JSON.parse(productIdsParam)
      } else {
        productIds = productIdsParam.split(',').map((id) => id.trim())
      }
    } catch (parseError) {
      return NextResponse.json(
        {
          error:
            'Invalid product_ids format. Use comma-separated values or JSON array.',
        },
        { status: 400 }
      )
    }

    // Validate the input
    const validation = productIdsSchema.safeParse({ product_ids: productIds })
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.issues },
        { status: 400 }
      )
    }

    // Convert to BigInt for database query
    const bigIntProductIds = productIds.map((id) => BigInt(id))

    // Query existing products
    const existingProducts = await prisma.product.findMany({
      where: {
        product_id: {
          in: bigIntProductIds,
        },
      },
      select: {
        product_id: true,
      },
    })

    // Convert BigInt back to string for JSON response
    const existingProductIds = existingProducts.map((product) =>
      product.product_id.toString()
    )

    return NextResponse.json({
      success: true,
      requested_count: productIds.length,
      existing_count: existingProductIds.length,
      existing_product_ids: existingProductIds,
      missing_product_ids: productIds
        .filter((id) => !existingProductIds.includes(id.toString()))
        .map((id) => id.toString()),
    })
  } catch (error) {
    console.error('Error checking product IDs:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST: Create new product
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate the input
    const validation = createProductSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.issues },
        { status: 400 }
      )
    }

    const { product_id, name, url, status_id, price, sellers } = validation.data

    // Check if product already exists
    const existingProduct = await prisma.product.findUnique({
      where: { product_id },
    })

    if (existingProduct) {
      return NextResponse.json(
        { error: 'Product with this product_id already exists' },
        { status: 409 }
      )
    }

    // Start a transaction to create product and associate sellers
    const result = await prisma.$transaction(async (tx) => {
      // Create the product
      const newProduct = await tx.product.create({
        data: {
          product_id,
          name,
          url,
          status_id,
          price,
        },
      })

      // If sellers are provided, create the associations
      if (sellers && sellers.length > 0) {
        const sellerIds = sellers.map((id) => BigInt(id))

        // Verify sellers exist
        const existingSellers = await tx.seller.findMany({
          where: {
            seller_id: {
              in: sellerIds,
            },
          },
          select: { seller_id: true },
        })

        const existingSellerIds = existingSellers.map((s) => s.seller_id)
        const missingSellerIds = sellerIds.filter(
          (id) => !existingSellerIds.some((existingId) => existingId === id)
        )

        if (missingSellerIds.length > 0) {
          throw new Error(
            `Sellers not found: ${missingSellerIds
              .map((id) => id.toString())
              .join(', ')}`
          )
        }

        // Create product-seller associations
        await tx.productSellers.createMany({
          data: existingSellerIds.map((seller_id) => ({
            product_id: newProduct.product_id,
            seller_id,
          })),
        })
      }

      // Return the created product with sellers
      return await tx.product.findUnique({
        where: { product_id: newProduct.product_id },
        include: {
          sellers: {
            include: {
              seller: true,
            },
          },
        },
      })
    })

    // Convert BigInt to string for JSON response
    const responseProduct = {
      ...result,
      id: result?.id.toString(),
      product_id: result?.product_id.toString(),
      sellers: result?.sellers.map((ps) => ({
        ...ps,
        product_id: ps.product_id.toString(),
        seller_id: ps.seller_id.toString(),
        seller: {
          ...ps.seller,
          id: ps.seller.id.toString(),
          seller_id: ps.seller.seller_id.toString(),
        },
      })),
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Product created successfully',
        product: responseProduct,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating product:', error)

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
