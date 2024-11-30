import fs from 'fs'
import { type NextRequest, NextResponse } from 'next/server'
import path from 'path'

import { getFileUrlById } from '@/lib/data'

import { auth } from '@/auth'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const { id } = await context.params

  try {
    const thisFile = await getFileUrlById(id)

    if (!thisFile) {
      return new NextResponse('File not found', { status: 404 })
    }

    if (process.env.STORAGE === 'vercel_blob') {
      const file = await fetch(thisFile.url)
      const blob = await file.arrayBuffer()

      if (!file.ok) {
        return new NextResponse('Failed to fetch file', { status: file.status })
      }

      const headers = new Headers(file.headers)
      headers.delete('content-encoding')

      return new NextResponse(blob, {
        headers,
        status: 200,
      })
    } else if (process.env.STORAGE === 'local') {
      // Construct file path
      const filePath = path.join(process.cwd(), thisFile.url)

      // Basic security check to prevent directory traversal
      const normalizedPath = path.normalize(filePath)
      if (!normalizedPath.startsWith(path.join(process.cwd(), 'storage'))) {
        return new NextResponse('Forbidden', { status: 403 })
      }

      // Check if file exists
      if (!fs.existsSync(filePath)) {
        return new NextResponse('File not found', { status: 404 })
      }

      // Read file
      const fileBuffer = fs.readFileSync(filePath)
      const stat = fs.statSync(filePath)

      // Determine content type
      const fileName = path.basename(filePath)
      const fileExtension = path.extname(fileName).toLowerCase()

      const contentType = thisFile.type

      // Return file with appropriate headers
      return new NextResponse(new Uint8Array(fileBuffer), {
        headers: {
          'Content-Type': contentType,
          'Content-Length': stat.size.toString(),
          'Content-Disposition': `inline; filename="${fileName}"`,
        },
      })
    }
  } catch (error) {
    console.error('Error fetching file:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
