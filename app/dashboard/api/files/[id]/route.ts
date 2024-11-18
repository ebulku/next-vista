import { type NextRequest } from 'next/server'
import { getFileUrlById } from '@/lib/data'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params

  try {
    const fileUrl = await getFileUrlById(id)

    if (!fileUrl) {
      return new Response('File not found', { status: 404 })
    }

    const file = await fetch(fileUrl)
    const blob = await file.arrayBuffer()

    if (!file.ok) {
      return new Response('Failed to fetch file', { status: file.status })
    }

    const headers = new Headers(file.headers)
    headers.delete('content-encoding')

    return new Response(blob, {
      headers,
      status: 200,
    })
  } catch (error) {
    console.error('Error fetching file:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
}
