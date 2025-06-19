import prisma from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// Validation schemas
const sellerIdsSchema = z.object({
  seller_ids: z
    .array(z.union([z.string(), z.number()]))
    .min(1, 'At least one seller_id is required'),
})

const createSellerSchema = z.object({
  seller_id: z.union([z.string(), z.number()]).transform((val) => BigInt(val)),
  name: z.string().min(1, 'Seller name is required'),
  phone: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  url: z.string().url().optional().nullable(),
  products: z
    .array(z.union([z.string(), z.number()]))
    .optional()
    .default([]),
})

// GET: Check which seller_ids exist
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sellerIdsParam = searchParams.get('seller_ids')

    if (!sellerIdsParam) {
      return NextResponse.json(
        { error: 'seller_ids parameter is required' },
        { status: 400 }
      )
    }

    // Parse the comma-separated seller_ids
    let sellerIds: (string | number)[]
    try {
      // Handle both comma-separated string and JSON array
      if (sellerIdsParam.startsWith('[')) {
        sellerIds = JSON.parse(sellerIdsParam)
      } else {
        sellerIds = sellerIdsParam.split(',').map((id) => id.trim())
      }
    } catch (parseError) {
      return NextResponse.json(
        {
          error:
            'Invalid seller_ids format. Use comma-separated values or JSON array.',
        },
        { status: 400 }
      )
    }

    // Validate the input
    const validation = sellerIdsSchema.safeParse({ seller_ids: sellerIds })
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.issues },
        { status: 400 }
      )
    }

    // Convert to BigInt for database query
    const bigIntSellerIds = sellerIds.map((id) => BigInt(id))

    // Query existing sellers
    const existingSellers = await prisma.seller.findMany({
      where: {
        seller_id: {
          in: bigIntSellerIds,
        },
      },
      select: {
        seller_id: true,
      },
    })

    // Convert BigInt back to string for JSON response
    const existingSellerIds = existingSellers.map((seller) =>
      seller.seller_id.toString()
    )

    return NextResponse.json({
      success: true,
      requested_count: sellerIds.length,
      existing_count: existingSellerIds.length,
      existing_seller_ids: existingSellerIds,
      missing_seller_ids: sellerIds
        .filter((id) => !existingSellerIds.includes(id.toString()))
        .map((id) => id.toString()),
    })
  } catch (error) {
    console.error('Error checking seller IDs:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST: Create new seller
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate the input
    const validation = createSellerSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.issues },
        { status: 400 }
      )
    }

    const { seller_id, name, phone, address, url, products } = validation.data

    // Check if seller already exists
    const existingSeller = await prisma.seller.findUnique({
      where: { seller_id },
    })

    if (existingSeller) {
      return NextResponse.json(
        { error: 'Seller with this seller_id already exists' },
        { status: 409 }
      )
    }

    // Start a transaction to create seller and associate products
    const result = await prisma.$transaction(async (tx) => {
      // Create the seller
      const newSeller = await tx.seller.create({
        data: {
          seller_id,
          name,
          phone,
          address,
          url,
        },
      })

      // If products are provided, create the associations
      if (products && products.length > 0) {
        const productIds = products.map((id) => BigInt(id))

        // Verify products exist
        const existingProducts = await tx.product.findMany({
          where: {
            product_id: {
              in: productIds,
            },
          },
          select: { product_id: true },
        })

        const existingProductIds = existingProducts.map((p) => p.product_id)
        const missingProductIds = productIds.filter(
          (id) => !existingProductIds.some((existingId) => existingId === id)
        )

        if (missingProductIds.length > 0) {
          throw new Error(
            `Products not found: ${missingProductIds
              .map((id) => id.toString())
              .join(', ')}`
          )
        }

        // Create product-seller associations
        await tx.productSellers.createMany({
          data: existingProductIds.map((product_id) => ({
            product_id,
            seller_id: newSeller.seller_id,
          })),
        })
      }

      // Return the created seller with products
      return await tx.seller.findUnique({
        where: { seller_id: newSeller.seller_id },
        include: {
          products: {
            include: {
              product: true,
            },
          },
        },
      })
    })

    // Convert BigInt to string for JSON response
    const responseSeller = {
      ...result,
      id: result?.id.toString(),
      seller_id: result?.seller_id.toString(),
      products: result?.products.map((ps) => ({
        ...ps,
        product_id: ps.product_id.toString(),
        seller_id: ps.seller_id.toString(),
        product: {
          ...ps.product,
          id: ps.product.id.toString(),
          product_id: ps.product.product_id.toString(),
        },
      })),
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Seller created successfully',
        seller: responseSeller,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating seller:', error)

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
