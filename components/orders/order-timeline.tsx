import { File, Note } from '@prisma/client'
import { FileDownIcon } from 'lucide-react'
import { headers } from 'next/headers'
import Image from 'next/image'
import Link from 'next/link'

import { fetchOrderFiles, fetchOrderNotes } from '@/lib/data'
import { formatDateToLocal, getHostname, isImageType } from '@/lib/utils'

import { Button } from '@/components/ui/button'
import {
  Timeline,
  TimelineContent,
  TimelineDot,
  TimelineHeading,
  TimelineItem,
  TimelineLine,
} from '@/components/ui/timeline'

import '@/styles/zoom.css'

type TimelineItemType = Note | File

export default async function OrderTimeline({ orderId }: { orderId: string }) {
  const notes = await fetchOrderNotes(orderId)
  const files = await fetchOrderFiles(orderId)

  const allNotes: TimelineItemType[] = [...notes, ...files].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  const headersList = await headers()
  const hostName = getHostname(headersList)

  return (
    <>
      <Timeline>
        {allNotes.map((item) => (
          <TimelineItem key={item.id}>
            <TimelineHeading variant="secondary">
              {formatDateToLocal(item.createdAt)}
            </TimelineHeading>
            <TimelineDot />
            <TimelineLine />
            <TimelineContent className="pt-4">
              {'url' in item && item.url && (
                <>
                  {isImageType(item.type) ? (
                    <>
                      <Image
                        width={500}
                        height={500}
                        src={`${hostName}/api/files/${item.id}`}
                        alt="Uploaded File"
                        className="object-cover rounded"
                      />
                      <Button variant={'ghost'} asChild>
                        <Link
                          href={`/api/files/${item.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FileDownIcon />
                          View High Resolution
                        </Link>
                      </Button>
                    </>
                  ) : (
                    <div className="flex items-center gap-4">
                      <Button
                        asChild
                        className="w-36 h-52 [&_svg]:size-10"
                        variant={'secondary'}
                      >
                        <Link
                          href={`/api/files/${item.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FileDownIcon />
                        </Link>
                      </Button>
                      <a
                        href={`/api/files/${item.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {item.name}
                      </a>
                    </div>
                  )}
                </>
              )}
              {'body' in item && item.body && <>{item.body}</>}
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </>
  )
}
